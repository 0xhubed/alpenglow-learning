#!/bin/bash

# Swiss Learning Game - Development Start Script
# This script starts Docker services, backend, and frontend

set -e  # Exit on any error

echo "🏔️ Starting Swiss Learning Game Development Environment..."
echo "=================================================="

# Check if Docker is installed and running
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Function to check if port is available
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "⚠️  Port $port is already in use"
        return 1
    fi
    return 0
}

# Check required ports
echo "🔍 Checking available ports..."
if ! check_port 3000; then
    echo "❌ Frontend port 3000 is already in use"
    exit 1
fi

if ! check_port 3001; then
    echo "❌ Backend port 3001 is already in use"
    exit 1
fi

if ! check_port 5432; then
    echo "⚠️  PostgreSQL port 5432 is in use (this might be okay)"
fi

if ! check_port 6379; then
    echo "⚠️  Redis port 6379 is in use (this might be okay)"
fi

# Start Docker services (PostgreSQL and Redis)
echo "🐳 Starting Docker services..."
if [ -f "docker-compose.yml" ]; then
    docker-compose up -d
    echo "✅ Docker services started"
else
    echo "❌ docker-compose.yml not found. Creating it..."
    cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    container_name: schweizer-lernspiel-postgres
    environment:
      POSTGRES_USER: lernspiel_user
      POSTGRES_PASSWORD: lernspiel_pass
      POSTGRES_DB: lernspiel_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U lernspiel_user -d lernspiel_db"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: schweizer-lernspiel-redis
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

volumes:
  postgres_data:
EOF
    docker-compose up -d
    echo "✅ Docker services started with new docker-compose.yml"
fi

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 5

# Check if services are healthy
if docker-compose ps | grep -q "Up (healthy)"; then
    echo "✅ Docker services are healthy"
else
    echo "⚠️  Services are starting, this might take a moment..."
    sleep 10
fi

# Start Backend
echo "🚀 Starting Backend..."
if [ -d "backend" ]; then
    cd backend
    
    # Check if .env file exists
    if [ ! -f ".env" ]; then
        echo "📝 Creating backend .env file..."
        cat > .env << 'EOF'
NODE_ENV=development
PORT=3001
DATABASE_URL="postgresql://lernspiel_user:lernspiel_pass@localhost:5432/lernspiel_db"
REDIS_URL="redis://localhost:6379"
JWT_SECRET=schweizer-lernspiel-dev-secret-key-2024
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
EOF
    fi
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing backend dependencies..."
        npm install
    fi
    
    # Run database migrations
    echo "🗄️  Running database migrations..."
    if [ -f "prisma/schema.prisma" ]; then
        npx prisma migrate dev --name init || echo "⚠️  Migration might have already been applied"
        npx prisma generate
    fi
    
    # Start backend in background
    echo "🚀 Starting backend server..."
    npm run dev > ../backend.log 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > ../backend.pid
    echo "✅ Backend started with PID: $BACKEND_PID"
    
    cd ..
else
    echo "❌ Backend directory not found"
    exit 1
fi

# Start Frontend
echo "🎨 Starting Frontend..."
if [ -d "frontend" ]; then
    cd frontend
    
    # Check if .env.local file exists
    if [ ! -f ".env.local" ]; then
        echo "📝 Creating frontend .env.local file..."
        cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
    fi
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing frontend dependencies..."
        npm install
    fi
    
    # Start frontend in background
    echo "🚀 Starting frontend server..."
    npm run dev > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > ../frontend.pid
    echo "✅ Frontend started with PID: $FRONTEND_PID"
    
    cd ..
else
    echo "❌ Frontend directory not found"
    exit 1
fi

# Wait a moment for servers to start
echo "⏳ Waiting for servers to start..."
sleep 5

# Check if servers are running
echo "🔍 Checking server status..."

# Check backend
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Backend is running at http://localhost:3001"
else
    echo "⚠️  Backend might still be starting..."
fi

# Check frontend
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is running at http://localhost:3000"
else
    echo "⚠️  Frontend might still be starting..."
fi

echo ""
echo "🎉 Development environment started successfully!"
echo "=================================================="
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:3001"
echo "🗄️  Database: postgresql://localhost:5432/lernspiel_db"
echo "📄 Logs:"
echo "   Backend:  tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "To stop all services, run: ./stop-dev.sh"
echo "=================================================="