#!/bin/bash

echo "🚀 Starting Food Ecommerce Website..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ] || [ ! -d "server/node_modules" ] || [ ! -d "client/node_modules" ]; then
    echo "📦 Installing dependencies..."
    ./setup.sh
fi

# Update UPI ID reminder
echo ""
echo "⚠️  IMPORTANT: Make sure to update your UPI ID in server/.env file"
echo "   Current UPI ID: $(grep UPI_ID server/.env | cut -d'=' -f2)"
echo ""

# Start the application
echo "🌟 Starting the application..."
echo "📱 Frontend will be available at: http://localhost:3000"
echo "🔧 Backend API will be available at: http://localhost:5000"
echo "👨‍💼 Admin panel will be available at: http://localhost:3000/admin"
echo ""
echo "🔑 Default admin credentials:"
echo "   Email: admin@foodstore.com"
echo "   Password: password"
echo ""
echo "Press Ctrl+C to stop the application"
echo ""

# Start both frontend and backend
npm run dev
