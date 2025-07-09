# Node.js Email Service

A robust and feature-rich email service built with Node.js and Express, designed for sending emails with comprehensive logging and monitoring capabilities.

## 🚀 Features

- **Email Sending**: Send emails with both plain text and HTML content
- **Multiple Email Providers**: Support for QQ Mail, Gmail, 163 Mail, and other SMTP services
- **Comprehensive Logging**: Detailed logging system with Winston for all email operations
- **Email Statistics**: Real-time statistics tracking for sent emails
- **Environment Configuration**: Easy configuration through environment variables
- **API Endpoints**: RESTful API for email operations and monitoring
- **Production Ready**: Includes PM2 configuration and Docker support
- **Error Handling**: Robust error handling with detailed error messages
- **Email Validation**: Built-in email format validation
- **Log Rotation**: Automatic log file rotation to prevent disk space issues

## 📋 Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Usage Examples](#usage-examples)
- [Logging System](#logging-system)
- [Deployment](#deployment)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## 🛠 Installation

### Prerequisites

- Node.js >= 14.0.0
- npm >= 6.0.0

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/node-email-service.git
cd node-email-service

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Configure your email settings in .env file
# See Configuration section below

# Start the service
npm start
```

## ⚙️ Configuration

Create a `.env` file in the root directory with your email configuration:

```env
PORT=5173

# Email Configuration
MAIL_HOST=smtp.qq.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=your-email@qq.com
MAIL_PASS=your-app-password
MAIL_FROM=your-email@qq.com
```

### Supported Email Providers

| Provider | Host           | Port | Secure |
| -------- | -------------- | ---- | ------ |
| QQ Mail  | smtp.qq.com    | 587  | false  |
| 163 Mail | smtp.163.com   | 465  | true   |
| Gmail    | smtp.gmail.com | 587  | false  |

## 📚 API Documentation

### Send Email

Send an email to a specific recipient.

**Endpoint:** `POST /send-email`

**Request Body:**

```json
{
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "text": "Plain text content",
  "html": "<h1>HTML content</h1>"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Email sent successfully",
  "messageId": "<message-id>",
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "logId": "2025-07-09T13:30:00.000Z"
}
```

### Verify Email Configuration

Verify if the email server configuration is correct.

**Endpoint:** `GET /verify-mail`

**Response:**

```json
{
  "success": true,
  "message": "Email service configuration is correct"
}
```

### Get Email Logs

Retrieve email sending records with filtering options.

**Endpoint:** `GET /mail-logs`

**Query Parameters:**

- `limit` (optional): Number of records to return (default: 100)
- `type` (optional): Log type - `all`, `success`, or `error` (default: all)

**Response:**

```json
{
  "success": true,
  "logs": [
    {
      "timestamp": "2025-07-09T13:30:00.000Z",
      "to": "recipient@example.com",
      "subject": "Email Subject",
      "status": "success",
      "messageId": "<message-id>",
      "duration": 1500,
      "size": 1024
    }
  ],
  "total": 1,
  "message": "Retrieved 1 email records"
}
```

### Get Email Statistics

Get comprehensive statistics about email sending.

**Endpoint:** `GET /mail-stats`

**Response:**

```json
{
  "success": true,
  "stats": {
    "total": 100,
    "success": 95,
    "error": 5,
    "today": 10,
    "thisWeek": 50,
    "thisMonth": 100
  },
  "message": "Email statistics retrieved successfully"
}
```

## 💡 Usage Examples

### Using cURL

```bash
# Send an email
curl -X POST http://localhost:5173/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient@example.com",
    "subject": "Test Email",
    "text": "This is a test email",
    "html": "<h1>Test Email</h1><p>This is a test email</p>"
  }'

# Verify email configuration
curl http://localhost:5173/verify-mail

# Get email logs
curl http://localhost:5173/mail-logs?limit=50&type=success

# Get email statistics
curl http://localhost:5173/mail-stats
```

### Using JavaScript (Node.js)

```javascript
const axios = require("axios");

const sendEmail = async () => {
  try {
    const response = await axios.post("http://localhost:5173/send-email", {
      to: "recipient@example.com",
      subject: "Test Email",
      text: "This is a test email",
      html: "<h1>Test Email</h1><p>This is a test email</p>",
    });

    console.log("Email sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending email:", error.response.data);
  }
};

sendEmail();
```

## 📋 Logging System

### Log Files

The service automatically creates and manages the following log files:

- `logs/mail.log` - All email records
- `logs/mail-success.log` - Successful email records only
- `logs/mail-error.log` - Failed email records only

### Log Content

Each log entry contains:

- `timestamp` - When the email was sent
- `to` - Recipient email address
- `subject` - Email subject
- `status` - Send status (success/error)
- `messageId` - Unique message identifier (for successful emails)
- `error` - Error message (for failed emails)
- `duration` - Time taken to send (in milliseconds)
- `size` - Email size in bytes

### Log Rotation

- Maximum file size: 5MB
- Keeps last 10 log files
- Automatic cleanup of old files

## 🚀 Deployment

### Development

```bash
# Install dependencies
npm install

# Start in development mode (with hot reload)
npm run dev

# Start normally
npm start
```

### Production with PM2

```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
npm run pm2:start

# Check status
npm run status

# View logs
npm run logs

# Restart service
npm run pm2:restart

# Stop service
npm run pm2:stop
```

### Docker Deployment

```bash
# Build Docker image
docker build -t node-email-service .

# Run container
docker run -d -p 5173:5173 --env-file .env node-email-service

# Or use docker-compose
docker-compose up -d
```

## 🔧 Development

### Project Structure

```
node-email-service/
├── server/
│   ├── app.js              # Main application file
│   ├── services/
│   │   └── mailService.js  # Email service logic
│   └── utils/
│       └── logger.js       # Logging configuration
├── logs/                   # Log files directory
├── public/                 # Static files
├── .env                    # Environment variables
├── .env.example           # Environment template
├── package.json           # Dependencies and scripts
├── ecosystem.config.js    # PM2 configuration
├── docker-compose.yml     # Docker compose configuration
├── Dockerfile            # Docker configuration
└── README.md             # This file
```

### Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with hot reload
- `npm run pm2:start` - Start with PM2 process manager
- `npm run pm2:stop` - Stop PM2 processes
- `npm run pm2:restart` - Restart PM2 processes
- `npm run status` - Check PM2 status
- `npm run logs` - View PM2 logs

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) - Web framework
- [Nodemailer](https://nodemailer.com/) - Email sending library
- [Winston](https://github.com/winstonjs/winston) - Logging library
- [PM2](https://pm2.keymetrics.io/) - Process manager

## 📞 Support

If you have any questions or need help, please open an issue in the GitHub repository.

---

Made with ❤️ by [superRice](https://github.com/yourusername)
