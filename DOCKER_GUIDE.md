# 🐳 Docker Guide - Food Store Ecommerce Platform

## Overview
This guide explains how to run the Food Store ecommerce platform using Docker containers. Docker provides an isolated, consistent environment that works across different systems without requiring local Node.js installation.

## 🚀 Quick Start with Docker

### Prerequisites
- **Docker**: Install from [docker.com](https://docs.docker.com/get-docker/)
- **Docker Compose**: Usually included with Docker Desktop

### Option 1: Using the Docker Run Script (Recommended)
```bash
# Clone the repository
git clone https://github.com/Kalasoftware/food-store.git
cd food-store

# Run with Docker (one command!)
./docker_run.sh
```

### Option 2: Using Docker Compose Directly
```bash
# Clone the repository
git clone https://github.com/Kalasoftware/food-store.git
cd food-store

# Start with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f
```

### Option 3: Using Docker Commands
```bash
# Build the image
docker build -t food-store .

# Run the container
docker run -d \
  --name food-store-app \
  -p 3000:3000 \
  -p 5000:5000 \
  -v food_store_data:/app/server/data \
  -v food_store_uploads:/app/server/uploads \
  food-store
```

## 📋 Docker Run Script Commands

The `docker_run.sh` script provides several useful commands:

```bash
# Start the application (default)
./docker_run.sh
./docker_run.sh start

# Stop the containers
./docker_run.sh stop

# Restart the containers
./docker_run.sh restart

# View logs
./docker_run.sh logs

# Check container status
./docker_run.sh status

# Clean up (remove containers and volumes)
./docker_run.sh clean

# Show help
./docker_run.sh help
```

## 🔧 Configuration

### Environment Variables
The Docker setup uses these environment variables (configurable in `docker-compose.yml`):

```yaml
environment:
  - NODE_ENV=production
  - PORT=5000
  - NEXT_PORT=3000
  - JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
  - UPI_ID=your-upi-id@paytm
  - BUSINESS_NAME=Food Store
  - CORS_ORIGIN=http://localhost:3000
```

### Customizing Configuration
1. **Edit docker-compose.yml** to change environment variables
2. **Create server/.env** file for local overrides
3. **Restart containers** to apply changes

```bash
# Edit configuration
nano docker-compose.yml

# Restart to apply changes
./docker_run.sh restart
```

## 📁 Docker Files Explained

### Dockerfile
- **Multi-stage build** for optimized image size
- **Node.js 18 Alpine** base image for security and size
- **Non-root user** for security
- **Health checks** for monitoring
- **Volume mounts** for data persistence

### docker-compose.yml
- **Service definition** for the application
- **Port mapping** (3000 for frontend, 5000 for backend)
- **Volume mounts** for data persistence
- **Environment variables** configuration
- **Health checks** and restart policies

### .dockerignore
- **Excludes unnecessary files** from Docker build
- **Reduces image size** and build time
- **Improves security** by excluding sensitive files

## 🗂️ Data Persistence

### Volumes
Docker uses named volumes to persist data:

```yaml
volumes:
  food_store_data:      # Database and application data
  food_store_uploads:   # User uploaded files (product images)
```

### Backup Data
```bash
# Backup database
docker cp food-store-app:/app/server/database.sqlite ./backup-database.sqlite

# Backup uploads
docker cp food-store-app:/app/server/uploads ./backup-uploads
```

### Restore Data
```bash
# Restore database
docker cp ./backup-database.sqlite food-store-app:/app/server/database.sqlite

# Restore uploads
docker cp ./backup-uploads food-store-app:/app/server/
```

## 🔍 Monitoring and Debugging

### View Logs
```bash
# All logs
./docker_run.sh logs

# Follow logs in real-time
docker-compose logs -f

# Specific service logs
docker-compose logs food-store
```

### Container Shell Access
```bash
# Access container shell
docker-compose exec food-store sh

# Or using docker directly
docker exec -it food-store-app sh
```

### Health Checks
The container includes health checks that monitor:
- Backend API availability (`http://localhost:5000/api/health`)
- Service responsiveness
- Container health status

```bash
# Check health status
docker ps
# Look for "healthy" status

# Detailed health check
docker inspect food-store-app | grep -A 10 Health
```

## 🚀 Production Deployment

### Security Considerations
1. **Change default secrets**:
   ```yaml
   - JWT_SECRET=your_very_secure_secret_key_here
   ```

2. **Update UPI credentials**:
   ```yaml
   - UPI_ID=your-actual-upi-id@bank
   - BUSINESS_NAME=Your Business Name
   ```

3. **Use environment files**:
   ```bash
   # Create .env file
   echo "JWT_SECRET=your_secure_secret" > .env
   
   # Reference in docker-compose.yml
   env_file:
     - .env
   ```

### Scaling and Load Balancing
```yaml
# docker-compose.yml for multiple instances
services:
  food-store:
    # ... existing config
    deploy:
      replicas: 3
    
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
```

### SSL/HTTPS Setup
```yaml
# Add SSL termination with nginx
services:
  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
      - "80:80"
    volumes:
      - ./ssl:/etc/nginx/ssl
      - ./nginx-ssl.conf:/etc/nginx/nginx.conf
```

## 🛠️ Development with Docker

### Development Mode
```bash
# Run in development mode with hot reload
docker-compose -f docker-compose.dev.yml up
```

### Debugging
```bash
# Run with debug ports exposed
docker run -p 3000:3000 -p 5000:5000 -p 9229:9229 food-store

# Attach debugger to port 9229
```

### Code Changes
For development, you can mount your local code:
```yaml
volumes:
  - ./client:/app/client
  - ./server:/app/server
  - /app/client/node_modules
  - /app/server/node_modules
```

## 📊 Performance Optimization

### Image Size Optimization
- **Multi-stage builds** reduce final image size
- **Alpine Linux** base image (smaller than Ubuntu)
- **Production dependencies only** in final stage
- **.dockerignore** excludes unnecessary files

### Runtime Performance
- **Non-root user** for security
- **Health checks** for monitoring
- **Proper signal handling** for graceful shutdowns
- **Volume mounts** for data persistence

## 🔧 Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   # Check what's using the port
   lsof -i :3000
   lsof -i :5000
   
   # Stop conflicting services
   ./docker_run.sh stop
   ```

2. **Permission denied**:
   ```bash
   # Make script executable
   chmod +x docker_run.sh
   ```

3. **Container won't start**:
   ```bash
   # Check logs
   ./docker_run.sh logs
   
   # Check container status
   docker ps -a
   ```

4. **Database issues**:
   ```bash
   # Reset database
   ./docker_run.sh clean
   ./docker_run.sh start
   ```

### Debug Commands
```bash
# Container information
docker inspect food-store-app

# Resource usage
docker stats food-store-app

# Network information
docker network ls
docker network inspect food-store-network

# Volume information
docker volume ls
docker volume inspect food_store_data
```

## 🆚 Docker vs Local Development

### Use Docker When:
- ✅ You want consistent environment across systems
- ✅ You don't want to install Node.js locally
- ✅ You're deploying to production with Docker
- ✅ You want isolated development environment
- ✅ You're sharing the project with others

### Use Local Development When:
- ✅ You want faster development cycles
- ✅ You need to debug with IDE integration
- ✅ You want direct file system access
- ✅ You're familiar with Node.js development
- ✅ You need maximum performance

## 📚 Additional Resources

### Docker Documentation
- [Docker Official Docs](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Dockerfile Best Practices](https://docs.docker.com/develop/dev-best-practices/)

### Food Store Specific
- [Local Development Guide](QUICK_START.md)
- [Feature Documentation](COMPLETE_FEATURES_LIST.md)
- [Admin Guide](ADMIN_TESTING_GUIDE.md)

## 🎉 Success!

Your Food Store ecommerce platform is now running in Docker! 

### Access Your Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Panel**: http://localhost:3000/admin

### Default Credentials
- **Email**: admin@foodstore.com
- **Password**: password

### Next Steps
1. Update your UPI ID in the configuration
2. Add your products through the admin panel
3. Test the complete workflow
4. Customize the branding and settings

**Happy containerized development! 🐳🚀**
