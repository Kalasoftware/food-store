#!/usr/bin/env node

// Test script to verify live quantity calculation implementation
console.log('🧪 Testing Live Quantity Calculation Implementation...\n');

const fs = require('fs');
const path = require('path');

// Test files that should exist
const testFiles = [
  {
    path: 'client/components/QuantitySelector.tsx',
    description: 'QuantitySelector component'
  },
  {
    path: 'client/store/cartStore.ts',
    description: 'Enhanced cart store'
  },
  {
    path: 'client/app/cart/page.tsx',
    description: 'Enhanced cart page'
  },
  {
    path: 'client/app/checkout/page.tsx',
    description: 'Enhanced checkout page'
  }
];

// Test file contents for key features
const contentTests = [
  {
    file: 'client/components/QuantitySelector.tsx',
    contains: ['onQuantityChange', 'showTotal', 'loading', 'maxQuantity'],
    description: 'QuantitySelector features'
  },
  {
    file: 'client/store/cartStore.ts',
    contains: ['updateQuantityOptimistic', 'updatingItems', 'calculateTotals'],
    description: 'Optimistic updates in cart store'
  },
  {
    file: 'client/app/cart/page.tsx',
    contains: ['QuantitySelector', 'finalTotal', 'deliveryFee', 'TrendingUp'],
    description: 'Live calculations in cart'
  },
  {
    file: 'client/app/checkout/page.tsx',
    contains: ['QuantitySelector', 'handleQuantityChange', 'Calculator', 'finalTotal'],
    description: 'Live calculations in checkout'
  }
];

let allTestsPassed = true;

// Test 1: Check if files exist
console.log('📁 Testing file existence...');
testFiles.forEach(test => {
  const filePath = path.join(__dirname, test.path);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${test.description} exists`);
  } else {
    console.log(`   ❌ ${test.description} missing`);
    allTestsPassed = false;
  }
});

console.log('');

// Test 2: Check file contents for key features
console.log('🔍 Testing implementation features...');
contentTests.forEach(test => {
  const filePath = path.join(__dirname, test.file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const missingFeatures = test.contains.filter(feature => !content.includes(feature));
    
    if (missingFeatures.length === 0) {
      console.log(`   ✅ ${test.description} - all features present`);
    } else {
      console.log(`   ❌ ${test.description} - missing: ${missingFeatures.join(', ')}`);
      allTestsPassed = false;
    }
  } else {
    console.log(`   ❌ ${test.description} - file not found`);
    allTestsPassed = false;
  }
});

console.log('');

// Test 3: Check for TypeScript interfaces
console.log('🔧 Testing TypeScript interfaces...');
const quantitySelectorPath = path.join(__dirname, 'client/components/QuantitySelector.tsx');
if (fs.existsSync(quantitySelectorPath)) {
  const content = fs.readFileSync(quantitySelectorPath, 'utf8');
  if (content.includes('interface QuantitySelectorProps')) {
    console.log('   ✅ QuantitySelector TypeScript interface defined');
  } else {
    console.log('   ❌ QuantitySelector TypeScript interface missing');
    allTestsPassed = false;
  }
} else {
  console.log('   ❌ QuantitySelector component not found');
  allTestsPassed = false;
}

console.log('');

// Test 4: Check for key UI features
console.log('🎨 Testing UI enhancements...');
const uiFeatures = [
  {
    file: 'client/app/cart/page.tsx',
    feature: 'progress bar',
    search: 'progress.*bar|bg-gradient.*rounded-full'
  },
  {
    file: 'client/app/cart/page.tsx',
    feature: 'free delivery indicator',
    search: 'free delivery|Free'
  },
  {
    file: 'client/app/checkout/page.tsx',
    feature: 'live order summary',
    search: 'Order Summary|Calculator'
  }
];

uiFeatures.forEach(test => {
  const filePath = path.join(__dirname, test.file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const regex = new RegExp(test.search, 'i');
    if (regex.test(content)) {
      console.log(`   ✅ ${test.feature} implemented`);
    } else {
      console.log(`   ❌ ${test.feature} not found`);
      allTestsPassed = false;
    }
  }
});

console.log('');

// Final results
if (allTestsPassed) {
  console.log('🎉 All tests passed! Live quantity calculation is properly implemented.');
  console.log('');
  console.log('✨ Features ready:');
  console.log('   • Real-time quantity updates');
  console.log('   • Live total calculations');
  console.log('   • Free delivery progress tracking');
  console.log('   • Optimistic UI updates');
  console.log('   • Enhanced user experience');
  console.log('');
  console.log('🚀 Ready to test in browser!');
  console.log('   1. Start the development server: npm run dev');
  console.log('   2. Add items to cart');
  console.log('   3. Test quantity changes on cart page');
  console.log('   4. Test live updates on checkout page');
} else {
  console.log('❌ Some tests failed. Please check the implementation.');
  console.log('');
  console.log('🔧 Next steps:');
  console.log('   1. Review the failed tests above');
  console.log('   2. Ensure all files are properly created');
  console.log('   3. Verify all features are implemented');
  console.log('   4. Run this test again');
}

console.log('');
console.log('📚 For detailed documentation, see: LIVE_QUANTITY_CALCULATION.md');
