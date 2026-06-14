# Inteko y'Abaturage Backend API

Backend REST API for the Community Meeting Management System for Rwanda's local governance.

## Technology Stack

- **Java 17**
- **Spring Boot 3.2.0**
- **PostgreSQL 15+**
- **Spring Security + JWT**
- **Spring Data JPA**
- **Maven**
- **Flyway** (Database Migrations)
- **MapStruct** (DTO Mapping)
- **Lombok** (Code Generation)

## Prerequisites

- JDK 17 or higher
- Maven 3.8+
- PostgreSQL 15+
- Git

## Quick Start

### 1. Database Setup

**Option A: Using Docker (Recommended)**

```bash
cd backend
docker-compose up -d postgres
```

**Option B: Using provided scripts**

```bash
# Linux/Mac
cd backend/scripts
chmod +x init-db.sh
./init-db.sh

# Windows
cd backend\scripts
init-db.bat
```

**Option C: Manual PostgreSQL setup**

```bash
psql -U postgres
CREATE DATABASE inteko_db;
CREATE USER inteko_user WITH PASSWORD 'inteko_pass';
GRANT ALL PRIVILEGES ON DATABASE inteko_db TO inteko_user;
\q
```

For detailed database setup instructions, see [DATABASE_SETUP.md](DATABASE_SETUP.md)

### 2. Clone and Build

```bash
git clone <repository-url>
cd backend
mvn clean install
```

### 3. Configure Environment

Create `.env` file in project root:

```env
DATABASE_URL=jdbc:postgresql://localhost:5432/inteko_db
DATABASE_USERNAME=inteko_user
DATABASE_PASSWORD=inteko_password
JWT_SECRET=your-256-bit-secret-key-change-this-in-production
```

### 4. Run Application

```bash
# H2 in-memory database (default, no setup required)
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# PostgreSQL database
mvn spring-boot:run -Dspring-boot.run.profiles=postgres

# Using Docker Compose
docker-compose up backend
```

Application will start at: `http://localhost:8080/api/v1`

**Note:** When using PostgreSQL profile, Flyway will automatically run database migrations and seed initial data.

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/rw/gov/inteko/backend/
│   │   │   ├── IntekoBackendApplication.java
│   │   │   ├── config/           # Configuration classes
│   │   │   ├── controller/       # REST controllers
│   │   │   ├── dto/              # Data Transfer Objects
│   │   │   ├── entity/           # JPA entities
│   │   │   ├── repository/       # Data access layer
│   │   │   ├── service/          # Business logic
│   │   │   ├── security/         # Security & JWT
│   │   │   ├── exception/        # Custom exceptions
│   │   │   ├── mapper/           # MapStruct mappers
│   │   │   └── util/             # Utility classes
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-dev.yml
│   │       └── db/migration/     # Flyway migrations
│   └── test/                     # Unit & integration tests
├── pom.xml
└── README.md
```

## API Documentation

### Base URL
```
http://localhost:8080/api/v1
```

### Authentication Endpoints

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@inteko.gov.rw",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 86400,
    "user": {
      "id": 1,
      "email": "admin@inteko.gov.rw",
      "role": "ADMINISTRATOR"
    }
  }
}
```

### User Management

```http
GET    /users              # Get all users
GET    /users/{id}         # Get user by ID
POST   /users              # Create user (Admin only)
PUT    /users/{id}         # Update user (Admin only)
PATCH  /users/{id}/status  # Toggle user status
DELETE /users/{id}         # Delete user (Admin only)
```

### Meetings

```http
GET    /meetings           # Get all meetings
GET    /meetings/{id}      # Get meeting by ID
GET    /meetings/upcoming  # Get upcoming meetings
POST   /meetings           # Create meeting
PATCH  /meetings/{id}/status  # Update meeting status
```

### Issues

```http
GET    /issues                    # Get all issues
GET    /issues/{id}               # Get issue by ID
GET    /issues/category/{category}  # Get by category
POST   /issues                    # Report new issue
PATCH  /issues/{id}/assign        # Assign issue
PATCH  /issues/{id}/resolve       # Resolve issue
```

### Resolutions

```http
GET    /resolutions           # Get all resolutions
GET    /resolutions/{id}      # Get resolution by ID
POST   /resolutions           # Create resolution
PATCH  /resolutions/{id}/action-item/{itemId}/toggle  # Toggle action item
POST   /resolutions/{id}/comments  # Add comment
```

### Notifications

```http
GET    /notifications              # Get user notifications
GET    /notifications/unread       # Get unread notifications
PATCH  /notifications/{id}/read    # Mark as read
PATCH  /notifications/mark-all-read  # Mark all as read
```

## Security

### JWT Authentication

All endpoints except `/auth/**` require JWT token:

```http
Authorization: Bearer <your-jwt-token>
```

### Roles

- **ADMINISTRATOR**: Full system access
- **SECTOR_OFFICIAL**: Manage meetings, issues, resolutions
- **MEETING_SECRETARY**: Create meetings, record attendance

## Database Schema

The complete database schema is implemented using Flyway migrations. The system includes:

### Core Tables

- `user_accounts` - System users with role-based access control
- `sectors`, `cells`, `villages` - Geographic hierarchy (Rwanda administrative structure)
- `meetings` - Meeting records and scheduling
- `meeting_participants` - Attendance tracking
- `meeting_documents` - Meeting-related documents
- `issues` - Citizen issues and complaints
- `issue_comments` - Discussion threads on issues
- `resolutions` - Action resolutions and tracking
- `resolution_action_items` - Checklist items for resolutions
- `resolution_comments` - Resolution discussion
- `resolution_documents` - Resolution attachments
- `notifications` - User notifications
- `documents` - Document library
- `audit_logs` - Audit trail for all changes

### Database Views

Pre-built views for common queries:
- `active_users_view` - Active users with geographic context
- `meeting_statistics_view` - Meeting attendance metrics
- `issue_summary_view` - Issues with assignments and locations
- `resolution_progress_view` - Resolution completion tracking
- `geographic_hierarchy_view` - Complete geographic structure
- `unread_notifications_view` - Unread notifications by user
- `document_library_view` - Documents with metadata

### Seed Data

Initial development data includes:
- 3 Sectors (Kinyinya, Remera, Kimironko)
- 7 Cells across sectors
- 10 Villages with population data
- 7 Users (1 Admin, 3 Sector Officials, 3 Meeting Secretaries)
- Sample meetings, issues, and resolutions

**Default admin credentials:** `admin@inteko.gov.rw` / `password123`

For complete schema documentation, see [docs/03-database-schema.md](../docs/03-database-schema.md)

## Development

### Running Tests

```bash
# Run all tests
mvn test

# Run with coverage
mvn test jacoco:report
```

### Code Quality

```bash
# Format code
mvn spring-javaformat:apply

# Check style
mvn checkstyle:check
```

### Database Migrations

Flyway migrations are located in `src/main/resources/db/migration/`:
- `V1__initial_schema.sql` - Core tables and relationships
- `V2__triggers_and_views.sql` - Database triggers and views
- `V3__seed_data.sql` - Development seed data

```bash
# Check migration status
mvn flyway:info

# Run migrations manually
mvn flyway:migrate

# Validate migrations
mvn flyway:validate

# Clean database (⚠️ DESTRUCTIVE - dev only)
mvn flyway:clean
```

**Creating new migrations:**
1. Create file: `V{version}__{description}.sql`
   - Example: `V4__add_user_preferences.sql`
2. Write DDL/DML statements
3. Restart application or run `mvn flyway:migrate`

For useful SQL queries, see `src/main/resources/db/queries/useful_queries.sql`

## Deployment

### Docker

```bash
# Build image
docker build -t inteko-backend .

# Run container
docker run -p 8080:8080 \
  -e DATABASE_URL=jdbc:postgresql://host:5432/inteko_db \
  -e JWT_SECRET=your-secret \
  inteko-backend
```

### Production Configuration

1. Update `application-prod.yml`
2. Set environment variables
3. Enable HTTPS
4. Configure proper CORS origins
5. Set up monitoring and logging

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Change port in application.yml
server:
  port: 8081
```

**Database connection failed:**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Verify credentials
psql -U inteko_user -d inteko_db
```

**JWT errors:**
```bash
# Ensure JWT_SECRET is at least 256 bits
# Update application.yml or environment variable
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

Copyright © 2024 Republic of Rwanda

## Support

For issues and questions:
- Email: support@inteko.gov.rw
- Documentation: See `/docs` folder

## Next Steps

1. Review documentation in `/docs` folder
2. Set up PostgreSQL database
3. Configure environment variables
4. Run database migrations
5. Start application
6. Test API endpoints with Postman or curl
7. Integrate with frontend application

## Complete Implementation Guide

For detailed implementation of all layers (entities, repositories, services, controllers), refer to:

- `docs/01-backend-overview.md` - Architecture overview
- `docs/02-project-setup.md` - Initial setup
- `docs/03-database-schema.md` - Complete schema
- `docs/04-entity-models.md` - JPA entities
- `docs/05-repository-layer.md` - Data access
- `docs/06-service-layer.md` - Business logic
- `docs/07-controller-layer.md` - REST APIs
- `docs/08-authentication-security.md` - JWT security
- `docs/09-validation-error-handling.md` - Validation
- `docs/10-testing-strategy.md` - Testing
- `docs/11-deployment-guide.md` - Deployment
