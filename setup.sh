#!/bin/bash

echo "🚀 Setting up Food Ecommerce Website..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v18 or higher) first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install
cd ..

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install
cd ..

# Create uploads directory
echo "📁 Creating uploads directory..."
mkdir -p server/uploads

# Copy environment file if it doesn't exist
if [ ! -f server/.env ]; then
    echo "📝 Creating environment file..."
    cat > server/.env << EOL
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_$(date +%s)
UPI_ID=your-upi-id@paytm
BUSINESS_NAME=Your Food Store
NODE_ENV=development
EOL
    echo "⚠️  Please update the UPI_ID in server/.env with your actual UPI ID"
fi

# Create client environment file if it doesn't exist
if [ ! -f client/.env.local ]; then
    echo "📝 Creating client environment file..."
    cat > client/.env.local << EOL
NEXT_PUBLIC_API_URL=http://localhost:5000/api
EOL
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update your UPI ID in server/.env file"
echo "2. Run 'npm run dev' to start the application"
echo "3. Visit http://localhost:3000 to access the website"
echo "4. Visit http://localhost:3000/admin to access admin panel"
echo ""
echo "🔑 Default admin credentials:"
echo "   Email: admin@foodstore.com"
echo "   Password: password"
echo ""
echo "🚀 To start the application:"
echo "   npm run dev"
echo ""
