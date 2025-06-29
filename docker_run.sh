#!/bin/bash

# Food Store - Docker Run Script
# This script helps you run the Food Store ecommerce platform using Docker

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_color() {
    printf "${1}${2}${NC}\n"
}

# Function to print section headers
print_header() {
    echo ""
    print_color $CYAN "=================================="
    print_color $CYAN "$1"
    print_color $CYAN "=================================="
    echo ""
}

# Function to check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_color $RED "❌ Docker is not installed!"
        print_color $YELLOW "Please install Docker from: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_color $RED "❌ Docker Compose is not installed!"
        print_color $YELLOW "Please install Docker Compose from: https://docs.docker.com/compose/install/"
        exit 1
    fi
    
    print_color $GREEN "✅ Docker and Docker Compose are installed"
}

# Function to check if Docker daemon is running
check_docker_daemon() {
    if ! docker info &> /dev/null; then
        print_color $RED "❌ Docker daemon is not running!"
        print_color $YELLOW "Please start Docker and try again."
        exit 1
    fi
    
    print_color $GREEN "✅ Docker daemon is running"
}

# Function to create environment file
create_env_file() {
    if [ ! -f "server/.env" ]; then
        print_color $YELLOW "📝 Creating environment configuration..."
        
        if [ -f "server/.env.example" ]; then
            cp server/.env.example server/.env
            print_color $GREEN "✅ Environment file created from example"
        else
            # Create basic .env file
            cat > server/.env << EOF
# Server Configuration
PORT=5000
NODE_ENV=production

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_$(date +%s)

# UPI Payment Configuration
UPI_ID=your-upi-id@paytm
BUSINESS_NAME=Food Store

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
EOF
            print_color $GREEN "✅ Basic environment file created"
        fi
        
        print_color $YELLOW "⚠️  Please update server/.env with your actual UPI ID and other settings"
    else
        print_color $GREEN "✅ Environment file already exists"
    fi
}

# Function to build Docker image
build_image() {
    print_color $BLUE "🔨 Building Docker image..."
    
    if docker-compose build --no-cache; then
        print_color $GREEN "✅ Docker image built successfully"
    else
        print_color $RED "❌ Failed to build Docker image"
        exit 1
    fi
}

# Function to start containers
start_containers() {
    print_color $BLUE "🚀 Starting Food Store containers..."
    
    if docker-compose up -d; then
        print_color $GREEN "✅ Containers started successfully"
    else
        print_color $RED "❌ Failed to start containers"
        exit 1
    fi
}

# Function to show container status
show_status() {
    print_color $BLUE "📊 Container Status:"
    docker-compose ps
    echo ""
    
    print_color $BLUE "📋 Container Logs (last 10 lines):"
    docker-compose logs --tail=10
}

# Function to wait for services to be ready
wait_for_services() {
    print_color $BLUE "⏳ Waiting for services to be ready..."
    
    # Wait for backend to be ready
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
            print_color $GREEN "✅ Backend service is ready"
            break
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            print_color $RED "❌ Backend service failed to start within timeout"
            print_color $YELLOW "Check logs with: docker-compose logs"
            exit 1
        fi
        
        printf "."
        sleep 2
        ((attempt++))
    done
    
    # Wait a bit more for frontend
    sleep 5
    
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        print_color $GREEN "✅ Frontend service is ready"
    else
        print_color $YELLOW "⚠️  Frontend might still be starting up"
    fi
}

# Function to setup initial data
setup_initial_data() {
    print_color $BLUE "📦 Setting up initial data..."
    
    if docker-compose exec food-store node setup-categories.js; then
        print_color $GREEN "✅ Initial categories setup completed"
    else
        print_color $YELLOW "⚠️  Categories setup may have failed or already exists"
    fi
}

# Function to show access information
show_access_info() {
    print_header "🎉 Food Store is Ready!"
    
    print_color $GREEN "🌐 Access URLs:"
    print_color $CYAN "   Frontend:  http://localhost:3000"
    print_color $CYAN "   Backend:   http://localhost:5000"
    print_color $CYAN "   Admin:     http://localhost:3000/admin"
    echo ""
    
    print_color $GREEN "🔑 Default Admin Credentials:"
    print_color $CYAN "   Email:     admin@foodstore.com"
    print_color $CYAN "   Password:  password"
    echo ""
    
    print_color $GREEN "🛠️  Useful Commands:"
    print_color $CYAN "   View logs:     docker-compose logs -f"
    print_color $CYAN "   Stop:          docker-compose down"
    print_color $CYAN "   Restart:       docker-compose restart"
    print_color $CYAN "   Shell access:  docker-compose exec food-store sh"
    echo ""
    
    print_color $YELLOW "📝 Next Steps:"
    print_color $CYAN "   1. Update server/.env with your UPI ID"
    print_color $CYAN "   2. Access the admin panel to add products"
    print_color $CYAN "   3. Test the complete workflow"
    echo ""
}

# Function to handle cleanup
cleanup() {
    print_color $YELLOW "🧹 Cleaning up..."
    docker-compose down
    exit 0
}

# Function to show help
show_help() {
    print_header "Food Store Docker Runner"
    
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  start     Start the Food Store application (default)"
    echo "  stop      Stop the running containers"
    echo "  restart   Restart the containers"
    echo "  logs      Show container logs"
    echo "  status    Show container status"
    echo "  clean     Stop containers and remove volumes"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                # Start the application"
    echo "  $0 start          # Start the application"
    echo "  $0 logs           # View logs"
    echo "  $0 stop           # Stop containers"
    echo ""
}

# Main execution function
main() {
    local action=${1:-start}
    
    case $action in
        "start")
            print_header "🍕 Food Store - Docker Setup"
            check_docker
            check_docker_daemon
            create_env_file
            build_image
            start_containers
            wait_for_services
            setup_initial_data
            show_access_info
            ;;
        "stop")
            print_color $YELLOW "🛑 Stopping Food Store containers..."
            docker-compose down
            print_color $GREEN "✅ Containers stopped"
            ;;
        "restart")
            print_color $YELLOW "🔄 Restarting Food Store containers..."
            docker-compose restart
            print_color $GREEN "✅ Containers restarted"
            show_access_info
            ;;
        "logs")
            print_color $BLUE "📋 Container Logs:"
            docker-compose logs -f
            ;;
        "status")
            show_status
            ;;
        "clean")
            print_color $YELLOW "🧹 Cleaning up containers and volumes..."
            docker-compose down -v
            docker system prune -f
            print_color $GREEN "✅ Cleanup completed"
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            print_color $RED "❌ Unknown option: $action"
            show_help
            exit 1
            ;;
    esac
}

# Trap Ctrl+C
trap cleanup INT

# Run main function
main "$@"
