# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-07-09

### Added

- Initial release of Node.js Email Service
- Email sending functionality with plain text and HTML support
- Environment variable configuration for email providers
- Comprehensive logging system with Winston
- Email statistics and monitoring
- RESTful API endpoints for email operations
- Support for multiple email providers (QQ Mail, Gmail, 163 Mail)
- Email validation and error handling
- PM2 configuration for production deployment
- Docker support with docker-compose
- Automatic log rotation to prevent disk space issues
- Development mode with hot reload using nodemon

### Features

- **POST /send-email** - Send emails with validation
- **GET /verify-mail** - Verify email configuration
- **GET /mail-logs** - Retrieve email sending records
- **GET /mail-stats** - Get email statistics

### Security

- Environment variable configuration for sensitive data
- Input validation for email addresses
- Secure SMTP configuration options

### Documentation

- Comprehensive README with setup instructions
- API documentation with examples
- Contributing guidelines
- License information

## [Unreleased]

### Planned

- Email templates support
- Bulk email sending
- Email queue management
- Web dashboard for monitoring
- Email bounce handling
- Rate limiting
- Authentication middleware
- Email scheduling
- Multiple language support

---

For more details about changes, see the [commit history](https://github.com/yourusername/node-email-service/commits/main).
