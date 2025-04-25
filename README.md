# Pushover Backend

A backend service for managing and sending push notifications to devices.

## Features

- User authentication with JWT
- Device management
- Push notification sending and tracking
- API key authentication for external services

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd pushover-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy the `.env.example` file to `.env` (or create a new `.env` file)
   - Update the values in the `.env` file with your configuration

4. Set up the database:
   - Create a PostgreSQL database
   - Run the schema.sql script to create the tables:
     ```
     psql -U <username> -d <database> -f schema.sql
     ```

## Running the Application

### Development Mode

```
npm run dev
```

This will start the server with nodemon, which will automatically restart when changes are detected.

### Production Mode

```
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info

### Devices

- `GET /api/devices` - Get all devices for the current user
- `POST /api/devices` - Register a new device
- `DELETE /api/devices/:id` - Delete a device

### Notifications

- `GET /api/notifications` - Get all notifications for the current user
- `POST /api/notifications/send` - Send a new notification (requires API key)
- `DELETE /api/notifications/:id` - Delete a notification

## Authentication

The API uses two types of authentication:

1. JWT tokens for web app access
   - Include the token in the Authorization header: `Authorization: Bearer <token>`

2. API keys for external services
   - Include the API key in the header: `X-API-Key: <api-key>`

## License

ISC
