# 🚀 Quick Start Guide

## ✅ Complete Food Ecommerce Website Ready!

Your complete full-stack ecommerce website is now ready with all features working properly.

### 🎯 What's Included:
- ✅ **Frontend**: Next.js 15 with TypeScript, Tailwind CSS
- ✅ **Backend**: Node.js + Express + SQLite database
- ✅ **Authentication**: JWT-based login/register system
- ✅ **Product Management**: Full CRUD with categories
- ✅ **Shopping Cart**: Add, update, remove items
- ✅ **Dynamic QR Payments**: UPI integration with your ID
- ✅ **Order Management**: Complete order lifecycle
- ✅ **Admin Dashboard**: Comprehensive management panel
- ✅ **Sample Data**: 10 products, 5 categories pre-loaded
- ✅ **Responsive Design**: Mobile-first approach

## 🏃‍♂️ Quick Start (2 minutes):

### 1. Update Your UPI ID
```bash
# Edit server/.env file
nano server/.env

# Change this line:
UPI_ID=your-upi-id@paytm
# To your actual UPI ID like:
UPI_ID=yourname@paytm
```

### 2. Start the Application
```bash
# Single command to start everything
./start.sh

# Or manually:
npm run dev
```

### 3. Access Your Website
- **🌐 Website**: http://localhost:3000
- **👨‍💼 Admin Panel**: http://localhost:3000/admin
- **🔧 API**: http://localhost:5000

### 4. Login Credentials
**Admin Account:**
- Email: `admin@foodstore.com`
- Password: `password`

**Customer Account:**
- Register a new account or use any email

## 📱 Features Overview:

### Customer Features:
- Browse 10 pre-loaded food products
- Search and filter by categories
- Add items to shopping cart
- Secure checkout process
- Dynamic QR code payment
- Order tracking and history
- User profile management

### Admin Features:
- Dashboard with sales analytics
- Product management (add/edit/delete)
- Category management
- Order management and status updates
- Customer management
- Low stock alerts
- Image upload for products

### Payment System:
- Dynamic QR code generation
- UPI integration with your ID
- Order-specific payment amounts
- Payment status tracking

## 🛠️ Technical Details:

### Database:
- SQLite database with sample data
- 10 food products across 5 categories
- Admin user pre-created
- Proper relationships and constraints

### Security:
- JWT authentication
- Password hashing with bcrypt
- Input validation
- Rate limiting
- CORS protection

### File Structure:
```
food-ecommerce/
├── client/          # Next.js frontend
├── server/          # Node.js backend
├── start.sh         # Quick start script
└── setup.sh         # Setup script
```

## 🎨 Customization:

### Add Your Products:
1. Login to admin panel
2. Go to Products → Add Product
3. Upload images and set details

### Modify Categories:
1. Admin panel → Categories
2. Add/edit categories as needed

### Update Branding:
- Edit `client/components/layout/Navbar.tsx`
- Update logo and business name
- Modify colors in `tailwind.config.js`

## 🔧 Troubleshooting:

### Port Already in Use:
```bash
# Kill processes on ports 3000 and 5000
sudo lsof -ti:3000 | xargs kill -9
sudo lsof -ti:5000 | xargs kill -9
```

### Database Issues:
```bash
# Reset database
rm server/database.sqlite
npm run server  # Will recreate with sample data
```

### Module Not Found:
```bash
# Reinstall dependencies
rm -rf node_modules server/node_modules client/node_modules
./setup.sh
```

## 📞 Support:

If you encounter any issues:
1. Check the console for error messages
2. Ensure all dependencies are installed
3. Verify your UPI ID is correctly set
4. Make sure ports 3000 and 5000 are available

## 🎉 You're Ready!

Your complete food ecommerce website is now running with:
- ✅ Working frontend and backend
- ✅ Sample products and categories
- ✅ Admin panel access
- ✅ Payment system ready
- ✅ All features functional

Start customizing by adding your own products and updating the UPI ID for payments!

---

**Happy Selling! 🛒💰**
