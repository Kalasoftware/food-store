#!/usr/bin/env node

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'server', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('🚀 Setting up Categories Feature...\n');

// Sample categories data
const sampleCategories = [
  {
    name: 'Fresh Fruits',
    description: 'Fresh seasonal fruits, berries, and tropical fruits',
    image: null
  },
  {
    name: 'Vegetables',
    description: 'Fresh vegetables, leafy greens, and herbs',
    image: null
  },
  {
    name: 'Bakery',
    description: 'Fresh bread, pastries, cakes, and baked goods',
    image: null
  },
  {
    name: 'Meat & Poultry',
    description: 'Fresh meat, chicken, fish, and seafood',
    image: null
  },
  {
    name: 'Dairy Products',
    description: 'Milk, cheese, yogurt, and dairy items',
    image: null
  },
  {
    name: 'Frozen Foods',
    description: 'Frozen meals, vegetables, and ice cream',
    image: null
  },
  {
    name: 'Pantry Staples',
    description: 'Rice, pasta, oils, and cooking essentials',
    image: null
  },
  {
    name: 'Beverages',
    description: 'Juices, soft drinks, water, and beverages',
    image: null
  },
  {
    name: 'Snacks',
    description: 'Chips, crackers, nuts, and snack foods',
    image: null
  },
  {
    name: 'Health & Wellness',
    description: 'Organic, gluten-free, and health foods',
    image: null
  },
  {
    name: 'Spices & Seasonings',
    description: 'Spices, herbs, and cooking seasonings',
    image: null
  },
  {
    name: 'International Foods',
    description: 'Ethnic and international cuisine ingredients',
    image: null
  }
];

// Check if categories already exist
db.get('SELECT COUNT(*) as count FROM categories', (err, result) => {
  if (err) {
    console.error('❌ Database error:', err);
    process.exit(1);
  }

  if (result.count > 0) {
    console.log(`✅ Categories already exist (${result.count} found)`);
    console.log('   Skipping category setup...\n');
    showUsageInstructions();
    return;
  }

  console.log('📦 Adding sample categories...');

  // Insert sample categories
  const stmt = db.prepare('INSERT INTO categories (name, description, image) VALUES (?, ?, ?)');
  
  let completed = 0;
  sampleCategories.forEach((category, index) => {
    stmt.run([category.name, category.description, category.image], function(err) {
      if (err) {
        console.error(`❌ Error adding ${category.name}:`, err);
      } else {
        console.log(`   ✅ Added: ${category.name}`);
      }
      
      completed++;
      if (completed === sampleCategories.length) {
        stmt.finalize();
        console.log(`\n🎉 Successfully added ${completed} categories!\n`);
        showUsageInstructions();
      }
    });
  });
});

function showUsageInstructions() {
  console.log('📋 Categories Feature Usage:');
  console.log('');
  console.log('🔧 Admin Panel:');
  console.log('   • Navigate to http://localhost:3000/admin/categories');
  console.log('   • Add, edit, and delete categories');
  console.log('   • Use bulk operations for efficiency');
  console.log('   • Search and filter categories');
  console.log('');
  console.log('👥 Customer Interface:');
  console.log('   • Visit http://localhost:3000/categories');
  console.log('   • Browse all available categories');
  console.log('   • Click categories to view products');
  console.log('');
  console.log('🔗 API Endpoints:');
  console.log('   • GET /api/categories - List all categories');
  console.log('   • POST /api/categories - Create category (admin)');
  console.log('   • PUT /api/categories/:id - Update category (admin)');
  console.log('   • DELETE /api/categories/:id - Delete category (admin)');
  console.log('');
  console.log('🚀 Next Steps:');
  console.log('   1. Start the server: npm run dev');
  console.log('   2. Login as admin (admin@foodstore.com / password)');
  console.log('   3. Visit the admin categories page');
  console.log('   4. Start organizing your products!');
  console.log('');
  console.log('📚 For more details, see: CATEGORIES_FEATURE_COMPLETE.md');
  
  db.close();
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n👋 Setup cancelled');
  db.close();
  process.exit(0);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Unexpected error:', err);
  db.close();
  process.exit(1);
});
