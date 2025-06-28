# WasteVan Messaging Setup Guide

## Quick Start

### Prerequisites
- Node.js 18 or higher
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Environment
Create `.env` file in the backend directory:
```env

```

#### Start Backend Server
```bash
# Development mode with auto-reload
npm run dev

# Or production mode
npm start

# Or using the startup script
./start.sh dev
```

The backend will be available at `http://localhost:3001`

### 2. Frontend Setup

#### Install Socket.IO Client
```bash
cd Frontend
npm install socket.io-client
```

#### Configure Environment
Create or update `.env` file in the Frontend directory:
```env
# Existing variables
VITE_WASTE_VAN_TOKEN_ADDRESS=0x5257C0710C6f9A0320cEdD4a95f895caCE29F42C
VITE_WASTE_VAN_ADDRESS=0x8cDf4F0De3Ea0e434737A97bF84F62F5A5C19ff0
VITE_PINATA_API_KEY=your_pinata_api_key
VITE_PINATA_SECRET_KEY=your_pinata_secret_key

# New messaging variables
VITE_API_BASE_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001
```

#### Start Frontend
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 3. Test the Messaging Feature

1. **Connect Wallet**: Connect your MetaMask wallet
2. **Register as User**: Register with username and email
3. **Submit Waste Report**: Create a waste report
4. **Navigate to "My Reports"**: View your submitted reports
5. **Click "Chat with Agents"**: Open the messaging interface
6. **Send Messages**: Test sending messages

For agent testing:
1. **Register as Agent**: Use the agent registration
2. **View Agent Dashboard**: See pending reports
3. **Click "Chat with Reporter"**: Open messaging interface
4. **Send Messages**: Test agent-to-user communication

## Docker Deployment

### Using Docker Compose
```bash
cd backend
docker-compose up -d
```

### Using Docker Only
```bash
cd backend
docker build -t wastevan-backend .
docker run -p 3001:3001 --env-file .env wastevan-backend
```

## API Testing

### Health Check
```bash
curl http://localhost:3001/api/health
```

### Send Message (Example)
```bash
curl -X POST http://localhost:3001/api/messages \
  -H "Content-Type: application/json" \
  -d '{
    "reportId": 1,
    "sender": "0x742d35Cc6634C0532925a3b8D4C9db96590b5c8e",
    "content": "Hello, when can you collect this waste?",
    "isFromAgent": false,
    "reporterAddress": "0x742d35Cc6634C0532925a3b8D4C9db96590b5c8e"
  }'
```

### Get Messages
```bash
curl http://localhost:3001/api/messages/report/1
```

## Troubleshooting

### Common Issues

#### Backend Won't Start
- **Check Node.js version**: Ensure Node.js 18+ is installed
- **Check MongoDB connection**: Verify MongoDB_URL in .env
- **Check port availability**: Ensure port 3001 is not in use
- **Check dependencies**: Run `npm install` in backend directory

#### Frontend Can't Connect to Backend
- **Check backend is running**: Visit `http://localhost:3001/api/health`
- **Check CORS settings**: Ensure FRONTEND_URL matches your frontend URL
- **Check environment variables**: Verify VITE_API_BASE_URL and VITE_SOCKET_URL

#### Messages Not Appearing in Real-time
- **Check Socket.IO connection**: Look for connection logs in browser console
- **Check firewall**: Ensure WebSocket connections are allowed
- **Check browser compatibility**: Ensure modern browser with WebSocket support

#### Database Connection Issues
- **Check MongoDB Atlas**: Ensure cluster is running and accessible
- **Check IP whitelist**: Add your IP to MongoDB Atlas whitelist
- **Check connection string**: Verify MongoDB_URL format and credentials

### Debug Mode

#### Backend Debugging
```bash
# Enable debug logging
DEBUG=* npm run dev

# Or specific modules
DEBUG=socket.io:* npm run dev
```

#### Frontend Debugging
Open browser developer tools and check:
- Console for error messages
- Network tab for API requests
- WebSocket connections in Network tab

### Log Files

Backend logs are output to console. For production, consider using a logging service like:
- Winston for file logging
- Morgan for HTTP request logging
- PM2 for process management and logging

## Production Deployment

### Environment Variables for Production
```env
MongoDB_URL=mongodb+srv://your-production-cluster
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-production-domain.com
```

### Security Considerations
- Use HTTPS in production
- Set up proper CORS origins
- Implement rate limiting (already included)
- Use environment-specific MongoDB clusters
- Set up monitoring and alerting

### Scaling
- Use PM2 for process management
- Set up load balancer for multiple instances
- Consider Redis for session storage
- Implement database connection pooling

## Monitoring

### Health Checks
The backend provides a health check endpoint at `/api/health` that returns:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600
}
```

### Metrics to Monitor
- API response times
- Database connection status
- Socket.IO connection count
- Message throughput
- Error rates

## Support

If you encounter issues:

1. **Check the logs**: Backend console output and browser developer tools
2. **Verify configuration**: Ensure all environment variables are set correctly
3. **Test API endpoints**: Use curl or Postman to test backend directly
4. **Check network connectivity**: Ensure backend and frontend can communicate

For additional help, refer to:
- Backend README.md
- Frontend documentation
- MongoDB Atlas documentation
- Socket.IO documentation