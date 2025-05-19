# WasteVan Eco-Connect Backend

This is the backend server for the WasteVan Eco-Connect application. It provides API endpoints for managing waste reports, user accounts, and other features of the application.

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens for authentication

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (for database)

### Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/wastevan?retryWrites=true&w=majority
   NODE_ENV=development
   ```

   Replace `<username>` and `<password>` with your MongoDB Atlas credentials. You'll need to:
   - Create a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
   - Set up a new cluster
   - Create a database user
   - Get your connection string from the Atlas dashboard

3. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Waste Reports

- `GET /api/waste-reports` - Get all waste reports
- `GET /api/waste-reports/:id` - Get a specific waste report
- `POST /api/waste-reports` - Create a new waste report
- `PUT /api/waste-reports/:id` - Update a waste report
- `DELETE /api/waste-reports/:id` - Delete a waste report

## Project Structure

```
backend/
├── src/
│   ├── config/       # Configuration files
│   ├── controllers/  # Route controllers
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   └── server.js     # Main server file
├── package.json
└── README.md
```
