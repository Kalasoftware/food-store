const express = require('express');
const { body, validationResult } = require('express-validator');
const { db } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Apply admin middleware to all routes
router.use(authenticateToken, requireAdmin);

// Dashboard stats
router.get('/dashboard', (req, res) => {
  const stats = {};
  
  // Get total orders
  db.get('SELECT COUNT(*) as total FROM orders', (err, orderCount) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    stats.totalOrders = orderCount.total;

    // Get total revenue
    db.get('SELECT SUM(total_amount) as revenue FROM orders WHERE payment_status = "completed"', (err, revenue) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      stats.totalRevenue = revenue.revenue || 0;

      // Get total products
      db.get('SELECT COUNT(*) as total FROM products WHERE is_active = 1', (err, productCount) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        stats.totalProducts = productCount.total;

        // Get total customers
        db.get('SELECT COUNT(*) as total FROM users WHERE role = "customer"', (err, customerCount) => {
          if (err) return res.status(500).json({ message: 'Database error' });
          stats.totalCustomers = customerCount.total;

          // Get recent orders
          const recentOrdersQuery = `
            SELECT o.*, u.name as customer_name, u.email as customer_email
            FROM orders o
            JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
            LIMIT 10
          `;

          db.all(recentOrdersQuery, (err, recentOrders) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            stats.recentOrders = recentOrders;

            // Get low stock products
            db.all('SELECT * FROM products WHERE stock_quantity <= 10 AND is_active = 1 ORDER BY stock_quantity ASC', (err, lowStock) => {
              if (err) return res.status(500).json({ message: 'Database error' });
              stats.lowStockProducts = lowStock;

              res.json(stats);
            });
          });
        });
      });
    });
  });
});

// Product Management
router.get('/products', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  const query = `
    SELECT p.*, c.name as category_name 
    FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id 
    ORDER BY p.created_at DESC 
    LIMIT ? OFFSET ?
  `;

  db.all(query, [limit, offset], (err, products) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    db.get('SELECT COUNT(*) as total FROM products', (err, countResult) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      res.json({
        products,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(countResult.total / limit),
          totalItems: countResult.total
        }
      });
    });
  });
});

// Add product
router.post('/products', [
  body('name').trim().isLength({ min: 2 }).withMessage('Product name required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price required'),
  body('category_id').isInt().withMessage('Category required'),
  body('stock_quantity').isInt({ min: 0 }).withMessage('Valid stock quantity required')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, price, category_id, stock_quantity, image, weight, expiry_date, brand } = req.body;

  db.run(
    'INSERT INTO products (name, description, price, category_id, stock_quantity, image, weight, expiry_date, brand) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [name, description || null, price, category_id, stock_quantity, image || null, weight || null, expiry_date || null, brand || null],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Failed to add product' });
      }
      res.status(201).json({ message: 'Product added successfully', productId: this.lastID });
    }
  );
});

// Update product
router.put('/products/:id', [
  body('name').optional().trim().isLength({ min: 2 }),
  body('price').optional().isFloat({ min: 0 }),
  body('stock_quantity').optional().isInt({ min: 0 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const productId = req.params.id;
  const { name, description, price, category_id, stock_quantity, image, weight, expiry_date, brand, is_active } = req.body;

  const updates = [];
  const values = [];

  if (name) { updates.push('name = ?'); values.push(name); }
  if (description !== undefined) { updates.push('description = ?'); values.push(description); }
  if (price) { updates.push('price = ?'); values.push(price); }
  if (category_id) { updates.push('category_id = ?'); values.push(category_id); }
  if (stock_quantity !== undefined) { updates.push('stock_quantity = ?'); values.push(stock_quantity); }
  if (image !== undefined) { updates.push('image = ?'); values.push(image); }
  if (weight !== undefined) { updates.push('weight = ?'); values.push(weight); }
  if (expiry_date !== undefined) { updates.push('expiry_date = ?'); values.push(expiry_date); }
  if (brand !== undefined) { updates.push('brand = ?'); values.push(brand); }
  if (is_active !== undefined) { updates.push('is_active = ?'); values.push(is_active ? 1 : 0); }

  if (updates.length === 0) {
    return res.status(400).json({ message: 'No fields to update' });
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(productId);

  db.run(
    `UPDATE products SET ${updates.join(', ')} WHERE id = ?`,
    values,
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Failed to update product' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res.json({ message: 'Product updated successfully' });
    }
  );
});

// Delete product
router.delete('/products/:id', (req, res) => {
  db.run('UPDATE products SET is_active = 0 WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deactivated successfully' });
  });
});

// Order Management
router.get('/orders', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;
  const status = req.query.status;

  let query = `
    SELECT o.*, u.name as customer_name, u.email as customer_email, u.phone as customer_phone
    FROM orders o
    JOIN users u ON o.user_id = u.id
  `;
  let countQuery = 'SELECT COUNT(*) as total FROM orders';
  let params = [];
  let countParams = [];

  if (status) {
    query += ' WHERE o.status = ?';
    countQuery += ' WHERE status = ?';
    params.push(status);
    countParams.push(status);
  }

  query += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  db.all(query, params, (err, orders) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    db.get(countQuery, countParams, (err, countResult) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      res.json({
        orders,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(countResult.total / limit),
          totalItems: countResult.total
        }
      });
    });
  });
});

// Update order status
router.put('/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const orderId = req.params.id;

  if (!['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  db.run(
    'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [status, orderId],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Failed to update order status' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Order not found' });
      }

      res.json({ message: 'Order status updated successfully' });
    }
  );
});

// Get order details
router.get('/orders/:id', (req, res) => {
  const orderId = req.params.id;

  // Get order with customer details
  const orderQuery = `
    SELECT o.*, u.name as customer_name, u.email as customer_email, u.phone as customer_phone, u.address as customer_address
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE o.id = ?
  `;

  db.get(orderQuery, [orderId], (err, order) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Get order items
    const itemsQuery = `
      SELECT oi.*, p.name, p.image
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `;

    db.all(itemsQuery, [orderId], (err, items) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      res.json({
        order: {
          ...order,
          items
        }
      });
    });
  });
});

// Category Management
router.get('/categories', (req, res) => {
  db.all('SELECT * FROM categories ORDER BY name', (err, categories) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.json({ categories });
  });
});

router.post('/categories', [
  body('name').trim().isLength({ min: 2 }).withMessage('Category name required')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, image } = req.body;

  db.run(
    'INSERT INTO categories (name, description, image) VALUES (?, ?, ?)',
    [name, description || null, image || null],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Failed to add category' });
      }
      res.status(201).json({ message: 'Category added successfully', categoryId: this.lastID });
    }
  );
});

// Update category
router.put('/categories/:id', [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Category name must be at least 2 characters')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const categoryId = req.params.id;
  const { name, description, image } = req.body;

  const updates = [];
  const values = [];

  if (name) { updates.push('name = ?'); values.push(name); }
  if (description !== undefined) { updates.push('description = ?'); values.push(description); }
  if (image !== undefined) { updates.push('image = ?'); values.push(image); }

  if (updates.length === 0) {
    return res.status(400).json({ message: 'No fields to update' });
  }

  values.push(categoryId);

  db.run(
    `UPDATE categories SET ${updates.join(', ')} WHERE id = ?`,
    values,
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Failed to update category' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Category not found' });
      }

      res.json({ message: 'Category updated successfully' });
    }
  );
});

// Delete category
router.delete('/categories/:id', (req, res) => {
  const categoryId = req.params.id;

  // First check if any products are using this category
  db.get('SELECT COUNT(*) as count FROM products WHERE category_id = ? AND is_active = 1', [categoryId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.count > 0) {
      return res.status(400).json({ 
        message: `Cannot delete category. ${result.count} products are still using this category. Please reassign or remove those products first.` 
      });
    }

    // If no products are using this category, delete it
    db.run('DELETE FROM categories WHERE id = ?', [categoryId], function(err) {
      if (err) {
        return res.status(500).json({ message: 'Failed to delete category' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Category not found' });
      }

      res.json({ message: 'Category deleted successfully' });
    });
  });
});

// Customer Management
router.get('/customers', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  const query = `
    SELECT u.id, u.name, u.email, u.phone, u.address, u.created_at,
           COUNT(o.id) as total_orders,
           COALESCE(SUM(o.total_amount), 0) as total_spent
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
    WHERE u.role = 'customer'
    GROUP BY u.id
    ORDER BY u.created_at DESC
    LIMIT ? OFFSET ?
  `;

  db.all(query, [limit, offset], (err, customers) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    db.get('SELECT COUNT(*) as total FROM users WHERE role = "customer"', (err, countResult) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      res.json({
        customers,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(countResult.total / limit),
          totalItems: countResult.total
        }
      });
    });
  });
});

module.exports = router;
