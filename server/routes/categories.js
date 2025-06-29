const express = require('express');
const { body, validationResult } = require('express-validator');
const { db } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all categories (public endpoint)
router.get('/', (req, res) => {
  const query = `
    SELECT c.*, 
           COUNT(p.id) as product_count
    FROM categories c
    LEFT JOIN products p ON c.id = p.category_id AND p.is_active = 1
    GROUP BY c.id
    ORDER BY c.name
  `;

  db.all(query, (err, categories) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.json({ categories });
  });
});

// Get single category with products
router.get('/:id', (req, res) => {
  const categoryId = req.params.id;

  // Get category details
  db.get('SELECT * FROM categories WHERE id = ?', [categoryId], (err, category) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Get products in this category
    const productsQuery = `
      SELECT * FROM products 
      WHERE category_id = ? AND is_active = 1 
      ORDER BY created_at DESC
    `;

    db.all(productsQuery, [categoryId], (err, products) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      res.json({
        category: {
          ...category,
          products,
          product_count: products.length
        }
      });
    });
  });
});

// Get category statistics
router.get('/:id/stats', (req, res) => {
  const categoryId = req.params.id;

  const statsQuery = `
    SELECT 
      COUNT(p.id) as total_products,
      SUM(p.stock_quantity) as total_stock,
      AVG(p.price) as avg_price,
      MIN(p.price) as min_price,
      MAX(p.price) as max_price
    FROM products p
    WHERE p.category_id = ? AND p.is_active = 1
  `;

  db.get(statsQuery, [categoryId], (err, stats) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    res.json({ stats });
  });
});

// Admin routes - require authentication and admin role
router.use(authenticateToken, requireAdmin);

// Add new category
router.post('/', [
  body('name').trim().isLength({ min: 2 }).withMessage('Category name required'),
  body('description').optional().trim(),
  body('image').optional().isURL().withMessage('Image must be a valid URL')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, image } = req.body;

  // Check if category name already exists
  db.get('SELECT id FROM categories WHERE LOWER(name) = LOWER(?)', [name], (err, existing) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (existing) {
      return res.status(400).json({ message: 'Category name already exists' });
    }

    db.run(
      'INSERT INTO categories (name, description, image) VALUES (?, ?, ?)',
      [name, description || null, image || null],
      function(err) {
        if (err) {
          return res.status(500).json({ message: 'Failed to add category' });
        }
        res.status(201).json({ 
          message: 'Category added successfully', 
          categoryId: this.lastID 
        });
      }
    );
  });
});

// Update category
router.put('/:id', [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Category name must be at least 2 characters'),
  body('description').optional().trim(),
  body('image').optional().isURL().withMessage('Image must be a valid URL')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const categoryId = req.params.id;
  const { name, description, image } = req.body;

  // Check if category exists
  db.get('SELECT * FROM categories WHERE id = ?', [categoryId], (err, category) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if new name conflicts with existing category (if name is being changed)
    if (name && name.toLowerCase() !== category.name.toLowerCase()) {
      db.get('SELECT id FROM categories WHERE LOWER(name) = LOWER(?) AND id != ?', [name, categoryId], (err, existing) => {
        if (err) {
          return res.status(500).json({ message: 'Database error' });
        }

        if (existing) {
          return res.status(400).json({ message: 'Category name already exists' });
        }

        updateCategory();
      });
    } else {
      updateCategory();
    }

    function updateCategory() {
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
          
          res.json({ message: 'Category updated successfully' });
        }
      );
    }
  });
});

// Delete category
router.delete('/:id', (req, res) => {
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

// Bulk operations
router.post('/bulk/delete', [
  body('categoryIds').isArray().withMessage('Category IDs must be an array')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { categoryIds } = req.body;

  if (categoryIds.length === 0) {
    return res.status(400).json({ message: 'No categories selected' });
  }

  // Check if any of these categories have products
  const placeholders = categoryIds.map(() => '?').join(',');
  db.get(
    `SELECT COUNT(*) as count FROM products WHERE category_id IN (${placeholders}) AND is_active = 1`,
    categoryIds,
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (result.count > 0) {
        return res.status(400).json({ 
          message: `Cannot delete categories. ${result.count} products are still using these categories.` 
        });
      }

      // Delete categories
      db.run(
        `DELETE FROM categories WHERE id IN (${placeholders})`,
        categoryIds,
        function(err) {
          if (err) {
            return res.status(500).json({ message: 'Failed to delete categories' });
          }
          
          res.json({ 
            message: `${this.changes} categories deleted successfully`,
            deletedCount: this.changes
          });
        }
      );
    }
  );
});

module.exports = router;
