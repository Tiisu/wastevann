#!/bin/bash

# WasteVan Backend Startup Script

echo "🚀 Starting WasteVan Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create .env file with required environment variables."
    echo "📋 Required variables:"
    echo "   - MongoDB_URL"
    echo "   - PORT (optional, defaults to 3001)"
    echo "   - NODE_ENV (optional, defaults to development)"
    echo "   - FRONTEND_URL (optional, defaults to http://localhost:5173)"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

# Check if MongoDB connection string is set
if ! grep -q "MongoDB_URL=" .env; then
    echo "❌ MongoDB_URL not found in .env file"
    exit 1
fi

echo "✅ Environment check passed"
echo "🔗 Connecting to MongoDB..."

# Start the server
if [ "$1" = "dev" ]; then
    echo "🔧 Starting in development mode with auto-reload..."
    npm run dev
else
    echo "🚀 Starting in production mode..."
    npm start
fi