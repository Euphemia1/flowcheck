# FlowCheck API

FlowCheck is a modern workflow approval system built with Laravel. It provides a comprehensive solution for managing approval processes, document workflows, and team collaboration.

## Features

- **Workflow Management**: Create and manage complex approval workflows
- **Document Processing**: Handle document submissions and approvals
- **User Management**: Role-based access control and permissions
- **Real-time Notifications**: Stay updated on workflow progress
- **API-First Design**: RESTful API with comprehensive documentation
- **Secure Authentication**: Laravel Sanctum for API authentication

## Prerequisites

- PHP 8.1+
- Composer
- Node.js & npm
- MySQL or SQLite
- Git

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd flowcheck-api
```

2. Install PHP dependencies
```bash
composer install
```

3. Copy environment file and configure database
```bash
cp .env.example .env
# Edit .env file with your database credentials
```

4. Generate application key
```bash
php artisan key:generate
```

5. Run migrations
```bash
php artisan migrate
```

6. Start the development server
```bash
php artisan serve
```

## API Documentation

The API provides comprehensive endpoints for managing workflows and approvals. Key endpoints include:

- `POST /api/auth/login` - User authentication
- `GET /api/workflows` - List workflows
- `POST /api/workflows` - Create workflow
- `GET /api/workflows/{id}` - Get workflow details
- `POST /api/workflows/{id}/approve` - Approve workflow step

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Security

If you discover any security vulnerabilities, please send an email to the development team. All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
