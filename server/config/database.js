const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          phone TEXT,
          address TEXT,
          role TEXT DEFAULT 'customer',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Categories table
      db.run(`
        CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          image TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Products table
      db.run(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          price DECIMAL(10,2) NOT NULL,
          category_id INTEGER,
          stock_quantity INTEGER DEFAULT 0,
          image TEXT,
          weight TEXT,
          expiry_date DATE,
          brand TEXT,
          is_active BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (category_id) REFERENCES categories (id)
        )
      `);

      // Orders table
      db.run(`
        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          total_amount DECIMAL(10,2) NOT NULL,
          status TEXT DEFAULT 'pending',
          payment_status TEXT DEFAULT 'pending',
          payment_method TEXT DEFAULT 'upi',
          delivery_address TEXT NOT NULL,
          phone TEXT NOT NULL,
          notes TEXT,
          qr_code TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      // Order items table
      db.run(`
        CREATE TABLE IF NOT EXISTS order_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id INTEGER NOT NULL,
          product_id INTEGER NOT NULL,
          quantity INTEGER NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          FOREIGN KEY (order_id) REFERENCES orders (id),
          FOREIGN KEY (product_id) REFERENCES products (id)
        )
      `);

      // Cart table
      db.run(`
        CREATE TABLE IF NOT EXISTS cart (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          product_id INTEGER NOT NULL,
          quantity INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id),
          FOREIGN KEY (product_id) REFERENCES products (id),
          UNIQUE(user_id, product_id)
        )
      `);

      // Insert default admin user (password: 'password')
      db.run(`
        INSERT OR IGNORE INTO users (name, email, password, role) 
        VALUES ('Admin', 'admin@foodstore.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
      `);

      // Insert default categories
      db.run(`
        INSERT OR IGNORE INTO categories (id, name, description) VALUES 
        (1, 'Snacks', 'Packaged snacks and chips'),
        (2, 'Beverages', 'Drinks and juices'),
        (3, 'Dairy', 'Milk products and dairy items'),
        (4, 'Grains & Cereals', 'Rice, wheat, and other grains'),
        (5, 'Spices', 'Spices and seasonings')
      `);

      // Insert sample products
      db.run(`
        INSERT OR IGNORE INTO products (id, name, description, price, category_id, stock_quantity, weight, brand, is_active) VALUES 
        (1, 'Premium Basmati Rice', 'Long grain aromatic basmati rice perfect for biryanis and pulao', 299.99, 4, 50, '5kg', 'India Gate', 1),
        (2, 'Organic Whole Wheat Flour', 'Stone ground organic wheat flour for healthy rotis', 89.99, 4, 30, '2kg', 'Organic India', 1),
        (3, 'Mixed Fruit Juice', 'Fresh mixed fruit juice with no added sugar', 45.99, 2, 25, '1L', 'Real', 1),
        (4, 'Potato Chips - Classic Salted', 'Crispy potato chips with perfect salt seasoning', 25.99, 1, 100, '50g', 'Lays', 1),
        (5, 'Fresh Milk', 'Pure cow milk rich in calcium and protein', 28.99, 3, 20, '500ml', 'Amul', 1),
        (6, 'Turmeric Powder', 'Pure turmeric powder for cooking and health benefits', 65.99, 5, 40, '200g', 'MDH', 1),
        (7, 'Green Tea Bags', 'Premium green tea bags for healthy lifestyle', 125.99, 2, 35, '25 bags', 'Twinings', 1),
        (8, 'Paneer', 'Fresh cottage cheese perfect for curries', 85.99, 3, 15, '200g', 'Mother Dairy', 1),
        (9, 'Masala Oats', 'Healthy breakfast option with Indian spices', 55.99, 4, 45, '500g', 'Quaker', 1),
        (10, 'Chocolate Cookies', 'Delicious chocolate chip cookies for tea time', 35.99, 1, 60, '100g', 'Britannia', 1)
      `);

      console.log('✅ Database initialized successfully');
      resolve();
    });
  });
};

module.exports = { db, initializeDatabase };
