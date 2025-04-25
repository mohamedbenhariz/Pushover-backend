# Pushover API Postman Collection

This repository contains Postman collection and environment files for testing the Pushover backend API.

## Files

1. `Pushover-API.postman_collection.json` - The Postman collection containing all API endpoints
2. `Pushover-Environment.postman_environment.json` - The Postman environment variables

## How to Import

1. Open Postman
2. Click on "Import" button in the top left corner
3. Drag and drop both files or click "Upload Files" and select both files
4. Click "Import"

## Setting Up the Environment

1. After importing, click on the environment dropdown in the top right corner of Postman
2. Select "Pushover Environment"
3. The `baseUrl` variable is already set to `http://localhost:3001` by default
4. The `token` and `apiKey` variables will be automatically populated when you successfully login

## Using the Collection

### Authentication

1. First, use the "Register" request to create a new user account
2. Then, use the "Login" request to authenticate and get a JWT token and API key
   - The token and API key will be automatically saved to the environment variables

### Devices

All device endpoints require authentication with JWT token:

1. Use "Get All Devices" to list all devices
2. Use "Add Device" to create a new device
3. Use "Update Device" to modify an existing device (replace `:id` in the URL with the actual device ID)
4. Use "Delete Device" to remove a device (replace `:id` in the URL with the actual device ID)

### Notifications

1. Use "Send Notification (API Key)" to send a notification using your API key
2. Use "Get All Notifications" to list all notifications (requires JWT token)
3. Use "Delete Notification" to remove a notification (requires JWT token, replace `:id` in the URL with the actual notification ID)

## Testing Workflow

1. Register a new user
2. Login to get token and API key
3. Add a device
4. Send a notification
5. View notifications
6. Delete notification or device when done

## Notes

- The JWT token is included in the Authorization header as `Bearer {token}`
- The API key is included in the X-API-Key header
- Both the token and API key are automatically saved to environment variables after login
