# Project Setup Guide

## Prerequisites

### Required Software
- **Java Development Kit (JDK)**: Version 17 or higher
  - Download from [Oracle](https://www.oracle.com/java/technologies/downloads/) or use [OpenJDK](https://openjdk.org/)
  - Verify installation: `java -version`

- **Maven**: Version 3.8 or higher
  - Download from [Apache Maven](https://maven.apache.org/download.cgi)
  - Verify installation: `mvn -version`

- **PostgreSQL**: Version 15 or higher
  - Download from [PostgreSQL](https://www.postgresql.org/download/)
  - Verify installation: `psql --version`

- **Git**: Version control
  - Download from [Git SCM](https://git-scm.com/downloads)

- **IDE**: Recommended options
  - IntelliJ IDEA (Community or Ultimate)
  - Eclipse with Spring Tools
  - VS Code with Java extensions

### Optional Tools
- **Docker**: For containerization
- **Postman**: For API testing
- **pgAdmin**: PostgreSQL GUI tool
- **DBeaver**: Universal database tool

## Project Initialization

### Method 1: Spring Initializr (Recommended)

1. Visit [Spring Initializr](https://start.spring.io/)

2. Configure project metadata:
   - **Project**: Maven
   - **Language**: Java
   - **Spring Boot**: 3.2.x (latest stable)
   - **Packaging**: Jar
   - **Java**: 17

3. Project Metadata:
   - **Group**: `rw.gov.inteko`
   - **Artifact**: `inteko-backend`
   - **Name**: `inteko-backend`
   - **Description**: Backend API for Inteko y'Abaturage Community Meeting Management System
   - **Package name**: `rw.gov.inteko.backend`

4. Add Dependencies:
   - Spring Web
   - Spring Data JPA
   - PostgreSQL Driver
   - Spring Security
   - Lombok
   - Validation
   - Spring Boot DevTools
   - Spring Boot Actuator

5. Click "Generate" to download the project

6. Extract and open in your IDE

### Method 2: Manual Maven Setup

Create a `pom.xml` file with the following structure:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>
    
    <groupId>rw.gov.inteko</groupId>
    <artifactId>inteko-backend</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <name>inteko-backend</name>
    <description>Backend API for Inteko y'Abaturage System</description>
    
    <properties>
        <java.version>17</java.version>
        <mapstruct.version>1.5.5.Final</mapstruct.version>
        <jwt.version>0.12.3</jwt.version>
    </properties>
    
    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        
        <!-- Database -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        
        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>${jwt.version}</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>${jwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>${jwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        
        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        
        <!-- MapStruct -->
        <dependency>
            <groupId>org.mapstruct</groupId>
            <artifactId>mapstruct</artifactId>
            <version>${mapstruct.version}</version>
        </dependency>
        
        <!-- Flyway Migration -->
        <dependency>
            <groupId>org.flywaydb</groupId>
            <artifactId>flyway-core</artifactId>
        </dependency>
        
        <!-- Development Tools -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        
        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
            
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>17</source>
                    <target>17</target>
                    <annotationProcessorPaths>
                        <path>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                            <version>${lombok.version}</version>
                        </path>
                        <path>
                            <groupId>org.mapstruct</groupId>
                            <artifactId>mapstruct-processor</artifactId>
                            <version>${mapstruct.version}</version>
                        </path>
                    </annotationProcessorPaths>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

## Project Structure

Create the following directory structure:

```
inteko-backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── rw/
│   │   │       └── gov/
│   │   │           └── inteko/
│   │   │               └── backend/
│   │   │                   ├── IntekoBackendApplication.java
│   │   │                   ├── config/
│   │   │                   │   ├── SecurityConfig.java
│   │   │                   │   ├── JwtConfig.java
│   │   │                   │   └── CorsConfig.java
│   │   │                   ├── controller/
│   │   │                   │   ├── AuthController.java
│   │   │                   │   ├── UserController.java
│   │   │                   │   ├── MeetingController.java
│   │   │                   │   ├── IssueController.java
│   │   │                   │   └── ResolutionController.java
│   │   │                   ├── dto/
│   │   │                   │   ├── request/
│   │   │                   │   └── response/
│   │   │                   ├── entity/
│   │   │                   │   ├── User.java
│   │   │                   │   ├── Meeting.java
│   │   │                   │   ├── Issue.java
│   │   │                   │   └── Resolution.java
│   │   │                   ├── repository/
│   │   │                   │   ├── UserRepository.java
│   │   │                   │   ├── MeetingRepository.java
│   │   │                   │   ├── IssueRepository.java
│   │   │                   │   └── ResolutionRepository.java
│   │   │                   ├── service/
│   │   │                   │   ├── AuthService.java
│   │   │                   │   ├── UserService.java
│   │   │                   │   ├── MeetingService.java
│   │   │                   │   ├── IssueService.java
│   │   │                   │   └── ResolutionService.java
│   │   │                   ├── security/
│   │   │                   │   ├── JwtTokenProvider.java
│   │   │                   │   └── JwtAuthenticationFilter.java
│   │   │                   ├── exception/
│   │   │                   │   ├── GlobalExceptionHandler.java
│   │   │                   │   └── ResourceNotFoundException.java
│   │   │                   └── util/
│   │   │                       └── Constants.java
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-dev.yml
│   │       ├── application-prod.yml
│   │       └── db/
│   │           └── migration/
│   │               ├── V1__initial_schema.sql
│   │               └── V2__seed_data.sql
│   └── test/
│       └── java/
│           └── rw/
│               └── gov/
│                   └── inteko/
│                       └── backend/
│                           ├── controller/
│                           ├── service/
│                           └── repository/
├── .gitignore
├── README.md
├── pom.xml
└── docker-compose.yml
```

## Configuration Files

### 1. Application Configuration (`application.yml`)

```yaml
spring:
  application:
    name: inteko-backend
  
  profiles:
    active: dev
  
  jpa:
    show-sql: false
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.PostgreSQLDialect
  
  flyway:
    enabled: true
    baseline-on-migrate: true

server:
  port: 8080
  servlet:
    context-path: /api/v1

logging:
  level:
    rw.gov.inteko: DEBUG
    org.springframework.web: INFO
    org.hibernate: INFO

# JWT Configuration
jwt:
  secret: ${JWT_SECRET:your-256-bit-secret-key-change-this-in-production}
  expiration: 86400000 # 24 hours in milliseconds
```

### 2. Development Configuration (`application-dev.yml`)

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/inteko_db
    username: inteko_user
    password: inteko_password
    driver-class-name: org.postgresql.Driver
  
  jpa:
    show-sql: true
    hibernate:
      ddl-auto: validate

logging:
  level:
    rw.gov.inteko: DEBUG
    org.springframework.security: DEBUG
```

### 3. Production Configuration (`application-prod.yml`)

```yaml
spring:
  datasource:
    url: ${DATABASE_URL}
    username: ${DATABASE_USERNAME}
    password: ${DATABASE_PASSWORD}
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
  
  jpa:
    show-sql: false
    hibernate:
      ddl-auto: validate

logging:
  level:
    rw.gov.inteko: INFO
```

## PostgreSQL Database Setup

### Local Development Setup

1. **Create Database**:
```sql
CREATE DATABASE inteko_db;
CREATE USER inteko_user WITH PASSWORD 'inteko_password';
GRANT ALL PRIVILEGES ON DATABASE inteko_db TO inteko_user;
```

2. **Connect to Database**:
```bash
psql -U inteko_user -d inteko_db
```

3. **Verify Connection**:
```sql
\dt  -- List all tables (should be empty initially)
```

## Docker Setup (Optional)

### Docker Compose (`docker-compose.yml`)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: inteko-postgres
    environment:
      POSTGRES_DB: inteko_db
      POSTGRES_USER: inteko_user
      POSTGRES_PASSWORD: inteko_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - inteko-network

  backend:
    build: .
    container_name: inteko-backend
    ports:
      - "8080:8080"
    environment:
      SPRING_PROFILES_ACTIVE: dev
      DATABASE_URL: jdbc:postgresql://postgres:5432/inteko_db
      DATABASE_USERNAME: inteko_user
      DATABASE_PASSWORD: inteko_password
    depends_on:
      - postgres
    networks:
      - inteko-network

volumes:
  postgres_data:

networks:
  inteko-network:
    driver: bridge
```

### Dockerfile

```dockerfile
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY target/inteko-backend-*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

## Build and Run

### Using Maven

1. **Build the project**:
```bash
mvn clean install
```

2. **Run the application**:
```bash
mvn spring-boot:run
```

3. **Run with specific profile**:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop all services
docker-compose down
```

## Verification

### Health Check
Once the application starts, verify it's running:

```bash
# Health endpoint
curl http://localhost:8080/api/v1/actuator/health

# Expected response
{
  "status": "UP"
}
```

### IDE Setup

#### IntelliJ IDEA
1. Open the project
2. Enable annotation processing: Settings → Build, Execution, Deployment → Compiler → Annotation Processors
3. Install Lombok plugin
4. Run the main application class

#### VS Code
1. Install Java Extension Pack
2. Install Spring Boot Extension Pack
3. Run the application from the Spring Boot Dashboard

## Environment Variables

Create a `.env` file (don't commit to Git):

```bash
# Database
DATABASE_URL=jdbc:postgresql://localhost:5432/inteko_db
DATABASE_USERNAME=inteko_user
DATABASE_PASSWORD=inteko_password

# JWT
JWT_SECRET=your-super-secret-key-min-256-bits-change-in-production

# Server
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=dev
```

## Git Configuration

### .gitignore

```
# Compiled class files
*.class
target/
bin/

# IDE
.idea/
*.iml
.vscode/
.settings/
.project
.classpath

# Environment
.env
.env.local

# Logs
*.log
logs/

# OS
.DS_Store
Thumbs.db

# Package files
*.jar
*.war
*.nar
*.ear
*.zip
*.tar.gz
*.rar
```

## Next Steps

Your Spring Boot project is now set up! Proceed to:

→ `03-database-schema.md` - Design and create database tables
