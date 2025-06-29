# 🍕 Food Store - Complete Ecommerce Platform

A modern, full-stack food ecommerce website with dynamic QR code payments, live quantity calculations, and comprehensive admin management. Built with Next.js, Node.js, and SQLite for easy local deployment.

![Food Store](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)
![Docker](https://img.shields.io/badge/Docker-Supported-blue)

## ✨ Features

### 🛍️ Customer Features
- **Product Browsing**: Browse products by categories with advanced filtering
- **Live Cart Updates**: Real-time quantity calculations and total updates
- **Smart Search**: Search and filter products with instant results
- **Dynamic QR Payments**: Secure UPI payments via QR code generation
- **Order Tracking**: Complete order history and status tracking
- **Free Delivery Progress**: Visual progress tracking toward free delivery
- **Responsive Design**: Mobile-first design for all devices

### 👨‍💼 Admin Features
- **Comprehensive Dashboard**: Analytics, sales tracking, and insights
- **Product Management**: Complete CRUD operations with image uploads
- **Category Management**: Organize products with full category system
- **Order Management**: Process orders and update statuses
- **Customer Management**: View and manage customer accounts
- **Inventory Tracking**: Stock management and low-stock alerts
- **Bulk Operations**: Efficient bulk product and category management

### 🔧 Technical Features
- **Live Calculations**: Real-time price updates and quantity changes
- **Optimistic Updates**: Instant UI feedback with server synchronization
- **JWT Authentication**: Secure user authentication and authorization
- **SQLite Database**: Lightweight, file-based database for easy deployment
- **Image Management**: Local file storage with upload capabilities
- **Security Middleware**: Input validation, rate limiting, and XSS protection
- **TypeScript Support**: Full type safety across the application

## 🚀 Quick Start

### 🐳 Option 1: Docker (Recommended)
**No Node.js installation required!**

```bash
# Clone the repository
git clone https://github.com/Kalasoftware/food-store.git
cd food-store

# Run with Docker (one command!)
./docker_run.sh
```

**That's it!** The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Admin: http://localhost:3000/admin

### 💻 Option 2: Local Development

#### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

#### Installation
```bash
# Clone the repository
git clone https://github.com/Kalasoftware/food-store.git
cd food-store

# Install dependencies
./setup.sh

# Start the application
./start.sh
```

## 🔑 Default Credentials

### Admin Account
- **Email**: admin@foodstore.com
- **Password**: password

## 📁 Project Structure

```
food-store/
├── client/                 # Next.js frontend
│   ├── app/               # App router pages
│   ├── components/        # Reusable components
│   ├── lib/              # Utilities and API
│   ├── store/            # Zustand stores
│   └── types/            # TypeScript types
├── server/                # Node.js backend
│   ├── config/           # Database configuration
│   ├── middleware/       # Express middleware
│   ├── routes/           # API routes
│   └── uploads/          # File storage
├── docker-compose.yml    # Docker configuration
├── Dockerfile           # Docker image definition
└── docker_run.sh        # Docker run script
```

## 🐳 Docker Usage

### Quick Commands
```bash
# Start the application
./docker_run.sh start

# Stop the application
./docker_run.sh stop

# View logs
./docker_run.sh logs

# Restart services
./docker_run.sh restart

# Clean up everything
./docker_run.sh clean
```

### Manual Docker Commands
```bash
# Using Docker Compose
docker-compose up -d

# Using Docker directly
docker build -t food-store .
docker run -p 3000:3000 -p 5000:5000 food-store
```

For detailed Docker instructions, see [DOCKER_GUIDE.md](DOCKER_GUIDE.md)

## 🎯 Key Features Implemented

### Live Quantity Calculation
- Real-time total updates as users change quantities
- Free delivery progress tracking with visual indicators
- Optimistic UI updates for instant feedback
- Mobile-optimized quantity controls

### Complete Category System
- Full CRUD operations for categories
- Visual category browsing with icons and gradients
- Product filtering by categories
- Bulk category management

### Advanced Cart & Checkout
- Live cart updates without page refreshes
- Free delivery threshold tracking
- Secure UPI QR code payment system
- Order confirmation and tracking

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **React Hook Form** - Efficient form handling
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **SQLite** - Lightweight, serverless database
- **JWT** - JSON Web Tokens for authentication
- **Multer** - File upload handling
- **QRCode** - Dynamic QR code generation
- **Bcrypt** - Password hashing

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Health Checks** - Service monitoring
- **Volume Mounts** - Data persistence

## 📚 Documentation

- [Docker Guide](DOCKER_GUIDE.md) - Complete Docker setup and usage
- [Complete Features List](COMPLETE_FEATURES_LIST.md)
- [Live Quantity Calculation](LIVE_QUANTITY_CALCULATION.md)
- [Categories Feature Guide](CATEGORIES_FEATURE_COMPLETE.md)
- [Admin Testing Guide](ADMIN_TESTING_GUIDE.md)
- [UI/UX Improvements](UI_UX_IMPROVEMENTS.md)
- [Quick Start Guide](QUICK_START.md)

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting and CORS protection
- File upload restrictions
- SQL injection prevention
- Docker security best practices

## 🎨 UI/UX Highlights

- **Modern Design**: Clean, professional interface with coral theme
- **Responsive Layout**: Mobile-first design approach
- **Interactive Elements**: Smooth animations and transitions
- **Visual Feedback**: Loading states and progress indicators
- **Accessibility**: ARIA labels and keyboard navigation support

## 🚀 Deployment Options

### 🐳 Docker Deployment (Recommended)
- **Easy setup**: One command deployment
- **Consistent environment**: Works the same everywhere
- **Isolated**: No conflicts with system packages
- **Scalable**: Easy to scale with Docker Compose

### 💻 Local Deployment
- **Direct control**: Full access to the system
- **Development friendly**: Hot reload and debugging
- **Performance**: No containerization overhead
- **Customizable**: Easy to modify configurations

### ☁️ Production Considerations
- Set strong JWT_SECRET
- Configure proper CORS origins
- Set up SSL/HTTPS
- Configure file upload limits
- Set up database backups
- Use environment variables for secrets

## 🧪 Testing

Run the test scripts to verify implementation:

```bash
# Test categories feature
node setup-categories.js

# Test live calculation feature
node test-live-calculation.js
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Designed for local business use
- Optimized for performance and user experience
- Production-ready with comprehensive features
- Docker support for easy deployment

## 📞 Support

For support and questions:
- Create an issue in this repository
- Check the documentation files
- Review the troubleshooting guides
- See [DOCKER_GUIDE.md](DOCKER_GUIDE.md) for Docker-specific help

---

**Made with ❤️ for local food businesses**

*Ready for production use with all essential ecommerce features!*

### 🎯 Choose Your Setup Method:

| Method | Best For | Setup Time | Requirements |
|--------|----------|------------|--------------|
| 🐳 **Docker** | Quick start, Production | 2 minutes | Docker only |
| 💻 **Local** | Development, Customization | 5 minutes | Node.js 18+ |

**Get started in under 2 minutes with Docker! 🚀**
