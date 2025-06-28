# WasteVan Backend - Messaging API

## Overview

This backend provides a RESTful API and real-time messaging service for the WasteVan messaging feature. It uses MongoDB for data persistence and Socket.IO for real-time communication.

## Features

- **RESTful API** for message CRUD operations
- **Real-time messaging** via Socket.IO
- **MongoDB integration** for scalable data storage
- **Ethereum address validation** and authentication
- **Rate limiting** and security middleware
- **Message pagination** and filtering
- **Unread message tracking**
- **Message statistics**

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env`:
```env
MongoDB_URL=your_mongodb_connection_string
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

3. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Messages

#### Send Message
```http
POST /api/messages
Content-Type: application/json

{
  "reportId": 1,
  "sender": "0x742d35Cc6634C0532925a3b8D4C9db96590b5c8e",
  "content": "Hello, when can you collect this waste?",
  "isFromAgent": false,
  "reporterAddress": "0x742d35Cc6634C0532925a3b8D4C9db96590b5c8e",
  "collectedBy": null
}
```

#### Get Messages for Report
```http
GET /api/messages/report/1?limit=50&offset=0&since=2024-01-01T00:00:00Z
```

#### Get Unread Count
```http
GET /api/messages/unread/0x742d35Cc6634C0532925a3b8D4C9db96590b5c8e
```

#### Mark Messages as Read
```http
PATCH /api/messages/read
Content-Type: application/json

{
  "reportId": 1
}
```

#### Get Message Statistics
```http
GET /api/messages/stats/0x742d35Cc6634C0532925a3b8D4C9db96590b5c8e
```

### Health Check
```http
GET /api/health
```

## Real-time Events

### Socket.IO Events

#### Client to Server
- `join-report` - Join a report room for real-time updates
- `leave-report` - Leave a report room

#### Server to Client
- `new-message` - New message received for a report

### Usage Example
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

// Join report room
socket.emit('join-report', reportId);

// Listen for new messages
socket.on('new-message', (message) => {
  console.log('New message:', message);
});
```

## Data Models

### Message Schema
```javascript
{
  reportId: Number,           // Waste report ID
  sender: String,             // Ethereum address of sender
  content: String,            // Message content (max 500 chars)
  isFromAgent: Boolean,       // True if sender is an agent
  timestamp: Date,            // Message timestamp
  reporterAddress: String,    // Original reporter's address
  collectedBy: String,        // Collecting agent's address (if collected)
  isRead: Boolean,           // Read status
  parentMessageId: ObjectId  // For threading (future feature)
}
```

## Security

- **Rate limiting**: 100 requests per 15 minutes per IP
- **Input validation**: Joi schema validation
- **Address validation**: Ethereum address format checking
- **CORS protection**: Configured for frontend domain
- **Helmet**: Security headers
- **Content length limits**: Prevents large payload attacks

## Error Handling

The API returns consistent error responses:

```json
{
  "error": {
    "message": "Error description",
    "status": 400
  }
}
```

## Development

### Running Tests
```bash
npm test
```

### Code Structure
```
backend/
├── server.js              # Main server file
├── models/
│   └── Message.js         # MongoDB message model
├── routes/
│   └── messages.js        # Message API routes
├── middleware/
│   └── auth.js           # Authentication middleware
├── package.json
└── README.md
```

## Deployment

### Environment Variables for Production
```env
MongoDB_URL=mongodb+srv://...
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

### Docker Deployment (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## Monitoring

The server provides:
- Health check endpoint at `/api/health`
- Console logging for connections and errors
- Request/response logging in development mode

## Future Enhancements

- Message encryption for privacy
- File attachment support
- Message search functionality
- Advanced analytics
- Message archiving
- Push notifications
- Message threading
- Admin dashboard