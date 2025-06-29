#!/bin/bash

# Food Store - Start Script
# Starts both frontend and backend services

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🍕 Starting Food Store Ecommerce Platform...${NC}"

# Check if running in Docker
if [ -f /.dockerenv ]; then
    echo -e "${YELLOW}📦 Running in Docker container${NC}"
    DOCKER_MODE=true
else
    echo -e "${YELLOW}💻 Running on local machine${NC}"
    DOCKER_MODE=false
fi

# Function to start backend
start_backend() {
    echo -e "${BLUE}🚀 Starting backend server...${NC}"
    cd server
    
    # Create .env if it doesn't exist
    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            cp .env.example .env
            echo -e "${YELLOW}📝 Created .env from example${NC}"
        else
            echo -e "${YELLOW}⚠️  No .env file found, using defaults${NC}"
        fi
    fi
    
    # Start backend in background
    if [ "$DOCKER_MODE" = true ]; then
        # In Docker, run backend in background
        node index.js &
        BACKEND_PID=$!
        echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"
    else
        # On local machine, use npm script
        npm start &
        BACKEND_PID=$!
        echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"
    fi
    
    cd ..
}

# Function to start frontend
start_frontend() {
    echo -e "${BLUE}🎨 Starting frontend server...${NC}"
    cd client
    
    if [ "$DOCKER_MODE" = true ]; then
        # In Docker, run the built application
        if [ -d ".next/standalone" ]; then
            echo -e "${BLUE}🏗️  Running standalone build${NC}"
            node .next/standalone/server.js &
        else
            echo -e "${BLUE}🏗️  Running development mode${NC}"
            npm start &
        fi
    else
        # On local machine, use npm script
        npm start &
    fi
    
    FRONTEND_PID=$!
    echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"
    cd ..
}

# Function to wait for services
wait_for_services() {
    echo -e "${BLUE}⏳ Waiting for services to be ready...${NC}"
    
    # Wait for backend
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Backend is ready${NC}"
            break
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            echo -e "${YELLOW}⚠️  Backend health check timeout${NC}"
            break
        fi
        
        sleep 2
        ((attempt++))
    done
    
    # Wait for frontend
    sleep 5
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend is ready${NC}"
    else
        echo -e "${YELLOW}⚠️  Frontend might still be starting${NC}"
    fi
}

# Function to setup initial data
setup_initial_data() {
    echo -e "${BLUE}📦 Setting up initial data...${NC}"
    
    # Wait a bit more for database to be ready
    sleep 3
    
    if node setup-categories.js; then
        echo -e "${GREEN}✅ Initial setup completed${NC}"
    else
        echo -e "${YELLOW}⚠️  Initial setup may have failed or already exists${NC}"
    fi
}

# Function to show access information
show_access_info() {
    echo ""
    echo -e "${GREEN}🎉 Food Store is running!${NC}"
    echo ""
    echo -e "${BLUE}🌐 Access URLs:${NC}"
    echo -e "   Frontend:  http://localhost:3000"
    echo -e "   Backend:   http://localhost:5000"
    echo -e "   Admin:     http://localhost:3000/admin"
    echo ""
    echo -e "${BLUE}🔑 Default Admin Credentials:${NC}"
    echo -e "   Email:     admin@foodstore.com"
    echo -e "   Password:  password"
    echo ""
    
    if [ "$DOCKER_MODE" = true ]; then
        echo -e "${YELLOW}📦 Running in Docker - Use Ctrl+C to stop${NC}"
    else
        echo -e "${YELLOW}💻 Running locally - Use Ctrl+C to stop${NC}"
    fi
    echo ""
}

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Shutting down services...${NC}"
    
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    
    # Kill any remaining node processes
    pkill -f "node.*index.js" 2>/dev/null || true
    pkill -f "node.*server.js" 2>/dev/null || true
    
    echo -e "${GREEN}✅ Services stopped${NC}"
    exit 0
}

# Trap Ctrl+C
trap cleanup INT TERM

# Main execution
main() {
    # Check if not in Docker and dependencies need to be installed
    if [ "$DOCKER_MODE" = false ]; then
        if [ ! -d "node_modules" ] || [ ! -d "server/node_modules" ] || [ ! -d "client/node_modules" ]; then
            echo -e "${YELLOW}📦 Installing dependencies...${NC}"
            ./setup.sh
        fi
    fi
    
    start_backend
    sleep 3
    start_frontend
    wait_for_services
    setup_initial_data
    show_access_info
    
    # Keep the script running
    if [ "$DOCKER_MODE" = true ]; then
        # In Docker, wait for processes
        wait
    else
        # On local machine, wait for user input
        echo -e "${BLUE}Press Ctrl+C to stop the services${NC}"
        while true; do
            sleep 1
        done
    fi
}

# Run main function
main
