#!/bin/bash

# Swiss Learning Game - Development Stop Script
# This script stops Docker services, backend, and frontend

set -e  # Exit on any error

echo "🛑 Stopping Swiss Learning Game Development Environment..."
echo "=================================================="

# Function to stop process by PID file
stop_process() {
    local service_name=$1
    local pid_file=$2
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null 2>&1; then
            echo "🛑 Stopping $service_name (PID: $pid)..."
            kill $pid
            
            # Wait for process to stop
            local count=0
            while ps -p $pid > /dev/null 2>&1 && [ $count -lt 10 ]; do
                sleep 1
                count=$((count + 1))
            done
            
            # Force kill if still running
            if ps -p $pid > /dev/null 2>&1; then
                echo "⚡ Force stopping $service_name..."
                kill -9 $pid
            fi
            
            echo "✅ $service_name stopped"
        else
            echo "⚠️  $service_name was not running"
        fi
        rm -f "$pid_file"
    else
        echo "⚠️  No PID file found for $service_name"
    fi
}

# Stop Frontend
stop_process "Frontend" "frontend.pid"

# Stop Backend
stop_process "Backend" "backend.pid"

# Alternative: Kill by port (fallback method)
echo "🔍 Checking for any remaining processes on ports 3000 and 3001..."

# Kill processes on port 3000 (Frontend)
FRONTEND_PROCESSES=$(lsof -ti:3000 2>/dev/null || true)
if [ ! -z "$FRONTEND_PROCESSES" ]; then
    echo "🛑 Stopping remaining frontend processes..."
    echo $FRONTEND_PROCESSES | xargs kill -9 2>/dev/null || true
    echo "✅ Frontend processes stopped"
fi

# Kill processes on port 3001 (Backend)
BACKEND_PROCESSES=$(lsof -ti:3001 2>/dev/null || true)
if [ ! -z "$BACKEND_PROCESSES" ]; then
    echo "🛑 Stopping remaining backend processes..."
    echo $BACKEND_PROCESSES | xargs kill -9 2>/dev/null || true
    echo "✅ Backend processes stopped"
fi

# Stop Docker services
echo "🐳 Stopping Docker services..."
if [ -f "docker-compose.yml" ]; then
    docker-compose down
    echo "✅ Docker services stopped"
else
    echo "⚠️  docker-compose.yml not found, checking for running containers..."
    
    # Stop containers by name if they exist
    if docker ps -q --filter "name=schweizer-lernspiel-postgres" | grep -q .; then
        docker stop schweizer-lernspiel-postgres
        echo "✅ PostgreSQL container stopped"
    fi
    
    if docker ps -q --filter "name=schweizer-lernspiel-redis" | grep -q .; then
        docker stop schweizer-lernspiel-redis
        echo "✅ Redis container stopped"
    fi
fi

# Clean up log files (optional)
read -p "🗑️  Do you want to remove log files? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -f backend.log frontend.log
    echo "✅ Log files removed"
fi

# Clean up Docker resources (optional)
read -p "🐳 Do you want to remove Docker volumes? (This will delete database data) (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ -f "docker-compose.yml" ]; then
        docker-compose down -v
        echo "✅ Docker volumes removed"
    else
        docker volume rm schweizer-lernspiel_postgres_data 2>/dev/null || echo "⚠️  Volume may not exist"
    fi
fi

echo ""
echo "🎉 Development environment stopped successfully!"
echo "=================================================="
echo "All services have been stopped:"
echo "- ✅ Frontend (port 3000)"
echo "- ✅ Backend (port 3001)" 
echo "- ✅ PostgreSQL (port 5432)"
echo "- ✅ Redis (port 6379)"
echo ""
echo "To start again, run: ./start-dev.sh"
echo "=================================================="