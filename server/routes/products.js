const express = require('express');
const { db } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all products with pagination and filtering
router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const offset = (page - 1) * limit;
  const category = req.query.category;
  const search = req.query.search;

  let query = `
    SELECT p.*, c.name as category_name 
    FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id 
    WHERE p.is_active = 1
  `;
  let countQuery = 'SELECT COUNT(*) as total FROM products WHERE is_active = 1';
  let params = [];
  let countParams = [];

  if (category) {
    query += ' AND p.category_id = ?';
    countQuery += ' AND category_id = ?';
    params.push(category);
    countParams.push(category);
  }

  if (search) {
    query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
    countQuery += ' AND (name LIKE ? OR description LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm);
    countParams.push(searchTerm, searchTerm);
  }

  query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  // Get total count
  db.get(countQuery, countParams, (err, countResult) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    // Get products
    db.all(query, params, (err, products) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      const total = countResult.total;
      const totalPages = Math.ceil(total / limit);

      res.json({
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit
        }
      });
    });
  });
});

// Get single product
router.get('/:id', (req, res) => {
  const query = `
    SELECT p.*, c.name as category_name 
    FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id 
    WHERE p.id = ? AND p.is_active = 1
  `;

  db.get(query, [req.params.id], (err, product) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ product });
  });
});

// Get categories
router.get('/categories/all', (req, res) => {
  db.all('SELECT * FROM categories ORDER BY name', (err, categories) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.json({ categories });
  });
});

// Add to cart
router.post('/cart/add', authenticateToken, (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const userId = req.user.id;

  if (!productId) {
    return res.status(400).json({ message: 'Product ID required' });
  }

  // Check if product exists and has stock
  db.get('SELECT * FROM products WHERE id = ? AND is_active = 1', [productId], (err, product) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock_quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    // Check if item already in cart
    db.get('SELECT * FROM cart WHERE user_id = ? AND product_id = ?', [userId, productId], (err, existingItem) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (existingItem) {
        // Update quantity
        const newQuantity = existingItem.quantity + quantity;
        if (product.stock_quantity < newQuantity) {
          return res.status(400).json({ message: 'Insufficient stock' });
        }

        db.run('UPDATE cart SET quantity = ? WHERE id = ?', [newQuantity, existingItem.id], (err) => {
          if (err) {
            return res.status(500).json({ message: 'Failed to update cart' });
          }
          res.json({ message: 'Cart updated successfully' });
        });
      } else {
        // Add new item
        db.run('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)', 
          [userId, productId, quantity], (err) => {
          if (err) {
            return res.status(500).json({ message: 'Failed to add to cart' });
          }
          res.json({ message: 'Item added to cart successfully' });
        });
      }
    });
  });
});

// Get cart items
router.get('/cart/items', authenticateToken, (req, res) => {
  const query = `
    SELECT c.*, p.name, p.price, p.image, p.stock_quantity,
           (c.quantity * p.price) as total_price
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ? AND p.is_active = 1
    ORDER BY c.created_at DESC
  `;

  db.all(query, [req.user.id], (err, items) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    const totalAmount = items.reduce((sum, item) => sum + item.total_price, 0);

    res.json({ 
      items,
      totalAmount: parseFloat(totalAmount.toFixed(2))
    });
  });
});

// Update cart item quantity
router.put('/cart/:id', authenticateToken, (req, res) => {
  const { quantity } = req.body;
  const cartId = req.params.id;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ message: 'Valid quantity required' });
  }

  // Check if cart item belongs to user and get product info
  const query = `
    SELECT c.*, p.stock_quantity 
    FROM cart c 
    JOIN products p ON c.product_id = p.id 
    WHERE c.id = ? AND c.user_id = ?
  `;

  db.get(query, [cartId, req.user.id], (err, cartItem) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    if (cartItem.stock_quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    db.run('UPDATE cart SET quantity = ? WHERE id = ?', [quantity, cartId], (err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to update cart' });
      }
      res.json({ message: 'Cart updated successfully' });
    });
  });
});

// Remove from cart
router.delete('/cart/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM cart WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.json({ message: 'Item removed from cart' });
  });
});

// Clear cart
router.delete('/cart/clear/all', authenticateToken, (req, res) => {
  db.run('DELETE FROM cart WHERE user_id = ?', [req.user.id], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.json({ message: 'Cart cleared successfully' });
  });
});

module.exports = router;
