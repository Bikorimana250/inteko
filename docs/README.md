# Inteko y'Abaturage - Backend Documentation

## Welcome

This documentation provides a comprehensive guide for building the **Spring Boot + PostgreSQL** backend for the Inteko y'Abaturage Community Meeting Management System.

## About the Project

**Inteko y'Abaturage** is a comprehensive administrative platform for the Republic of Rwanda's local governance structure. It manages:

- Community meetings and attendance
- Citizen issue tracking and resolution
- User management with role-based access
- Geographic hierarchy (Sectors, Cells, Villages)
- Notifications and document management
- Analytics and reporting

## Documentation Index

### Phase 1: Foundation
1. **[Backend Overview](01-backend-overview.md)** - Architecture, tech stack, and project structure
2. **[Project Setup](02-project-setup.md)** - Initialize Spring Boot project with dependencies
3. **[Database Schema](03-database-schema.md)** - Complete PostgreSQL schema design

### Phase 2: Core Implementation
4. **[Entity Models](04-entity-models.md)** - JPA entities with relationships
5. **[Repository Layer](05-repository-layer.md)** - Data access with Spring Data JPA
6. **[Service Layer](06-service-layer.md)** - Business logic and DTOs
7. **[Controller Layer](07-controller-layer.md)** - REST API endpoints

### Phase 3: Security & Quality
8. **[Authentication & Security](08-authentication-security.md)** - JWT authentication and Spring Security
9. **[Validation & Error Handling](09-validation-error-handling.md)** - Input validation and exceptions
10. **[Testing Strategy](10-testing-strategy.md)** - Unit tests, integration tests, and coverage

### Phase 4: Deployment
11. **[Deployment Guide](11-deployment-guide.md)** - Production deployment with Docker

## Quick Start

### Prerequisites
- Java 17+
- Maven 3.8+
- PostgreSQL 15+
- Docker (optional)

### Setup Steps

```bash
# 1. Follow documentation in order
Start with: 01-backend-overview.md

# 2. Create Spring Boot project
Follow: 02-project-setup.md

# 3. Set up database
Follow: 03-database-schema.md

# 4. Implement layers step-by-step
Follow: 04-entity-models.md through 07-controller-layer.md

# 5. Add security
Follow: 08-authentication-security.md

# 6. Implement validation
Follow: 09-validation-error-handling.md

# 7. Write tests
Follow: 10-testing-strategy.md

# 8. Deploy to production
Follow: 11-deployment-guide.md
```

## Technology Stack

### Core Framework
- **Spring Boot 3.2.x** - Application framework
- **Java 17** - Programming language
- **Maven** - Build tool

### Database
- **PostgreSQL 15** - Relational database
- **Spring Data JPA** - ORM
- **Flyway** - Database migrations

### Security
- **Spring Security** - Authentication & authorization
- **JWT (jjwt)** - Token-based authentication
- **BCrypt** - Password hashing

### Development Tools
- **Lombok** - Reduce boilerplate code
- **MapStruct** - DTO mapping
- **Spring DevTools** - Hot reload
- **Spring Boot Actuator** - Monitoring

### Testing
- **JUnit 5** - Testing framework
- **Mockito** - Mocking
- **TestContainers** - Integration testing
- **AssertJ** - Assertions

## Project Structure

```
inteko-backend/
├── docs/                           # Documentation (this folder)
│   ├── 01-backend-overview.md
│   ├── 02-project-setup.md
│   ├── 03-database-schema.md
│   ├── 04-entity-models.md
│   ├── 05-repository-layer.md
│   ├── 06-service-layer.md
│   ├── 07-controller-layer.md
│   ├── 08-authentication-security.md
│   ├── 09-validation-error-handling.md
│   ├── 10-testing-strategy.md
│   └── 11-deployment-guide.md
├── src/
│   ├── main/
│   │   ├── java/rw/gov/inteko/backend/
│   │   │   ├── config/              # Configuration classes
│   │   │   ├── controller/          # REST controllers
│   │   │   ├── dto/                 # Data Transfer Objects
│   │   │   ├── entity/              # JPA entities
│   │   │   ├── repository/          # Data access layer
│   │   │   ├── service/             # Business logic
│   │   │   ├── security/            # Security components
│   │   │   ├── exception/           # Custom exceptions
│   │   │   ├── mapper/              # DTO mappers
│   │   │   └── util/                # Utility classes
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-dev.yml
│   │       ├── application-prod.yml
│   │       └── db/migration/        # Flyway migrations
│   └── test/                        # Test classes
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── pom.xml
└── README.md
```

## API Endpoints Summary

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/auth/me` - Get current user

### Users (Admin Only)
- `POST /api/v1/users` - Create user
- `GET /api/v1/users` - List users
- `GET /api/v1/users/{id}` - Get user
- `PUT /api/v1/users/{id}` - Update user
- `DELETE /api/v1/users/{id}` - Delete user

### Meetings
- `POST /api/v1/meetings` - Create meeting
- `GET /api/v1/meetings` - List meetings
- `GET /api/v1/meetings/{id}` - Get meeting
- `PATCH /api/v1/meetings/{id}/status` - Update status

### Issues
- `POST /api/v1/issues` - Report issue
- `GET /api/v1/issues` - List issues
- `GET /api/v1/issues/{id}` - Get issue
- `PATCH /api/v1/issues/{id}/assign` - Assign issue
- `PATCH /api/v1/issues/{id}/resolve` - Resolve issue

### Resolutions
- `POST /api/v1/resolutions` - Create resolution
- `GET /api/v1/resolutions` - List resolutions
- `GET /api/v1/resolutions/{id}` - Get resolution
- `PATCH /api/v1/resolutions/{id}/conclude` - Conclude resolution

### Notifications
- `GET /api/v1/notifications` - List notifications
- `GET /api/v1/notifications/unread` - Unread notifications
- `PATCH /api/v1/notifications/{id}/read` - Mark as read

## Development Workflow

### 1. Create Feature Branch
```bash
git checkout -b feature/user-management
```

### 2. Implement Feature
Follow the layered architecture:
1. Create entity in `entity/`
2. Create repository in `repository/`
3. Create service in `service/`
4. Create controller in `controller/`
5. Add tests

### 3. Run Tests
```bash
mvn test
```

### 4. Build & Run
```bash
mvn clean package
java -jar target/inteko-backend-*.jar
```

### 5. Commit & Push
```bash
git add .
git commit -m "feat: add user management"
git push origin feature/user-management
```

## Key Concepts

### Role-Based Access Control
- **Administrator**: Full system access
- **Sector Official**: Manage meetings, issues, resolutions
- **Meeting Secretary**: Record meetings, track attendance

### Data Flow
```
Client Request
    ↓
Controller (validation)
    ↓
Service (business logic)
    ↓
Repository (database access)
    ↓
PostgreSQL Database
```

### Security Flow
```
Request → JWT Filter → Authentication → Authorization → Endpoint
```

## Common Commands

```bash
# Build project
mvn clean install

# Run application
mvn spring-boot:run

# Run tests
mvn test

# Run with production profile
mvn spring-boot:run -Dspring-boot.run.profiles=prod

# Generate test coverage
mvn test jacoco:report

# Database migration
mvn flyway:migrate

# Docker build
docker build -t inteko-backend .

# Docker compose
docker-compose up -d
```

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection
psql -U inteko_user -d inteko_db -h localhost
```

### Port Already in Use
```bash
# Find process using port 8080
lsof -i :8080

# Kill process
kill -9 <PID>
```

### Maven Build Failures
```bash
# Clean Maven cache
mvn clean

# Update dependencies
mvn clean install -U
```

## Best Practices

1. **Layered Architecture**: Maintain clear separation between layers
2. **DTOs**: Never expose entities directly in APIs
3. **Validation**: Validate all inputs at controller level
4. **Error Handling**: Use custom exceptions with proper HTTP status codes
5. **Security**: Always use @PreAuthorize for sensitive endpoints
6. **Testing**: Write tests for all business logic
7. **Logging**: Log important operations and errors
8. **Documentation**: Keep API documentation up to date
9. **Code Review**: Review all code before merging
10. **Version Control**: Use meaningful commit messages

## Performance Tips

- Use pagination for large datasets
- Implement database indexes on frequently queried columns
- Use caching for read-heavy operations
- Optimize database queries (avoid N+1 problems)
- Configure connection pooling appropriately
- Monitor application metrics with Actuator

## Security Checklist

- [x] JWT authentication implemented
- [x] Password hashing with BCrypt
- [x] Role-based access control
- [x] Input validation on all endpoints
- [x] SQL injection prevention (JPA)
- [x] XSS protection
- [x] CSRF protection (API mode)
- [x] CORS configuration
- [x] HTTPS enforcement (production)
- [x] Security headers configured

## Resources

### Spring Framework
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Security Reference](https://spring.io/projects/spring-security)
- [Spring Data JPA Guide](https://spring.io/projects/spring-data-jpa)

### Database
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Flyway Documentation](https://flywaydb.org/documentation/)

### Testing
- [JUnit 5 User Guide](https://junit.org/junit5/docs/current/user-guide/)
- [Mockito Documentation](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html)
- [TestContainers](https://www.testcontainers.org/)

### Tools
- [Maven Documentation](https://maven.apache.org/guides/)
- [Docker Documentation](https://docs.docker.com/)

## Support

For questions or issues:
- **Email**: backend-support@inteko.gov.rw
- **Documentation**: This docs folder
- **Issue Tracker**: [GitHub Issues](https://github.com/inteko/backend/issues)

## License

Copyright © 2023 Republic of Rwanda - Ministry of Local Government

## Contributors

- Backend Architecture Team
- Rwanda Digital Acceleration Project

---

**Ready to start?** Begin with [01-backend-overview.md](01-backend-overview.md)

**Need help?** Refer to specific documentation files for detailed guidance on each topic.
