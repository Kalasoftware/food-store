const express = require('express');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Create order from cart
router.post('/create', authenticateToken, async (req, res) => {
  const { deliveryAddress, phone, notes } = req.body;
  const userId = req.user.id;

  if (!deliveryAddress || !phone) {
    return res.status(400).json({ message: 'Delivery address and phone are required' });
  }

  try {
    // Get cart items
    const cartQuery = `
      SELECT c.*, p.name, p.price, p.stock_quantity
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ? AND p.is_active = 1
    `;

    db.all(cartQuery, [userId], async (err, cartItems) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (cartItems.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }

      // Check stock availability
      for (const item of cartItems) {
        if (item.stock_quantity < item.quantity) {
          return res.status(400).json({ 
            message: `Insufficient stock for ${item.name}. Available: ${item.stock_quantity}` 
          });
        }
      }

      // Calculate total
      const totalAmount = cartItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);

      // Generate unique order ID for QR
      const orderReference = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Create UPI payment string
      const upiString = `upi://pay?pa=${process.env.UPI_ID}&pn=${process.env.BUSINESS_NAME}&am=${totalAmount}&cu=INR&tn=Order Payment ${orderReference}`;

      // Generate QR code
      const qrCodeDataURL = await QRCode.toDataURL(upiString);

      // Create order
      db.run(
        'INSERT INTO orders (user_id, total_amount, delivery_address, phone, notes, qr_code) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, totalAmount, deliveryAddress, phone, notes || null, qrCodeDataURL],
        function(err) {
          if (err) {
            return res.status(500).json({ message: 'Failed to create order' });
          }

          const orderId = this.lastID;

          // Add order items
          const orderItemsQuery = 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)';
          let itemsProcessed = 0;

          cartItems.forEach(item => {
            db.run(orderItemsQuery, [orderId, item.product_id, item.quantity, item.price], (err) => {
              if (err) {
                console.error('Error adding order item:', err);
                return;
              }

              // Update product stock
              db.run('UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?', 
                [item.quantity, item.product_id]);

              itemsProcessed++;
              
              if (itemsProcessed === cartItems.length) {
                // Clear cart
                db.run('DELETE FROM cart WHERE user_id = ?', [userId]);

                res.status(201).json({
                  message: 'Order created successfully',
                  order: {
                    id: orderId,
                    totalAmount,
                    qrCode: qrCodeDataURL,
                    orderReference,
                    upiString
                  }
                });
              }
            });
          });
        }
      );
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

// Get user orders
router.get('/my-orders', authenticateToken, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const query = `
    SELECT o.*, 
           GROUP_CONCAT(p.name || ' x' || oi.quantity) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = ?
    GROUP BY o.id
    ORDER BY o.created_at DESC
    LIMIT ? OFFSET ?
  `;

  db.all(query, [req.user.id, limit, offset], (err, orders) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    // Get total count
    db.get('SELECT COUNT(*) as total FROM orders WHERE user_id = ?', [req.user.id], (err, countResult) => {
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

// Get single order details
router.get('/:id', authenticateToken, (req, res) => {
  const orderId = req.params.id;

  // Get order details
  db.get('SELECT * FROM orders WHERE id = ? AND user_id = ?', [orderId, req.user.id], (err, order) => {
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

// Update payment status (for admin or webhook)
router.put('/:id/payment-status', authenticateToken, (req, res) => {
  const { paymentStatus } = req.body;
  const orderId = req.params.id;

  if (!['pending', 'completed', 'failed'].includes(paymentStatus)) {
    return res.status(400).json({ message: 'Invalid payment status' });
  }

  // Check if user owns the order or is admin
  const checkQuery = req.user.role === 'admin' 
    ? 'SELECT id FROM orders WHERE id = ?'
    : 'SELECT id FROM orders WHERE id = ? AND user_id = ?';
  
  const checkParams = req.user.role === 'admin' 
    ? [orderId] 
    : [orderId, req.user.id];

  db.get(checkQuery, checkParams, (err, order) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update payment status and order status
    const newOrderStatus = paymentStatus === 'completed' ? 'confirmed' : 'pending';
    
    db.run(
      'UPDATE orders SET payment_status = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [paymentStatus, newOrderStatus, orderId],
      (err) => {
        if (err) {
          return res.status(500).json({ message: 'Failed to update payment status' });
        }
        res.json({ message: 'Payment status updated successfully' });
      }
    );
  });
});

// Cancel order
router.put('/:id/cancel', authenticateToken, (req, res) => {
  const orderId = req.params.id;

  // Check if order belongs to user and can be cancelled
  db.get(
    'SELECT * FROM orders WHERE id = ? AND user_id = ? AND status IN ("pending", "confirmed")',
    [orderId, req.user.id],
    (err, order) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (!order) {
        return res.status(404).json({ message: 'Order not found or cannot be cancelled' });
      }

      // Get order items to restore stock
      db.all('SELECT * FROM order_items WHERE order_id = ?', [orderId], (err, items) => {
        if (err) {
          return res.status(500).json({ message: 'Database error' });
        }

        // Restore stock for each item
        items.forEach(item => {
          db.run('UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?',
            [item.quantity, item.product_id]);
        });

        // Update order status
        db.run(
          'UPDATE orders SET status = "cancelled", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [orderId],
          (err) => {
            if (err) {
              return res.status(500).json({ message: 'Failed to cancel order' });
            }
            res.json({ message: 'Order cancelled successfully' });
          }
        );
      });
    }
  );
});

module.exports = router;
