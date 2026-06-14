# Deployment Guide

## Overview

This document provides step-by-step instructions for deploying the Inteko backend to production environments.

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Security review completed
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] API documentation updated
- [ ] Performance testing completed
- [ ] Backup strategy in place
- [ ] Monitoring configured
- [ ] SSL certificates ready
- [ ] Domain name configured

## Environment Configuration

### Production Application Properties

```yaml
# application-prod.yml
spring:
  application:
    name: inteko-backend
  
  datasource:
    url: ${DATABASE_URL}
    username: ${DATABASE_USERNAME}
    password: ${DATABASE_PASSWORD}
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000
  
  jpa:
    show-sql: false
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        format_sql: false
        dialect: org.hibernate.dialect.PostgreSQLDialect
  
  flyway:
    enabled: true
    baseline-on-migrate: true
    locations: classpath:db/migration

server:
  port: ${PORT:8080}
  servlet:
    context-path: /api/v1
  compression:
    enabled: true
  http2:
    enabled: true

logging:
  level:
    root: INFO
    rw.gov.inteko: INFO
    org.springframework: WARN
    org.hibernate: WARN
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} - %msg%n"
  file:
    name: /var/log/inteko/backend.log
    max-size: 10MB
    max-history: 30

# JWT Configuration
jwt:
  secret: ${JWT_SECRET}
  expiration: 86400000 # 24 hours
  refreshExpiration: 604800000 # 7 days

# CORS
cors:
  allowed-origins: ${ALLOWED_ORIGINS:https://inteko.gov.rw}
```

### Environment Variables

```bash
# .env.production
DATABASE_URL=jdbc:postgresql://production-db-host:5432/inteko_prod
DATABASE_USERNAME=inteko_prod_user
DATABASE_PASSWORD=secure_production_password
JWT_SECRET=your-super-secure-256-bit-secret-key-for-production
ALLOWED_ORIGINS=https://inteko.gov.rw,https://www.inteko.gov.rw
SPRING_PROFILES_ACTIVE=prod
```

## Build for Production

### Maven Build

```bash
# Clean and build
mvn clean package -DskipTests

# Build with tests
mvn clean package

# Build optimized JAR
mvn clean package -Pprod

# Verify JAR
java -jar target/inteko-backend-1.0.0.jar --version
```

### Production Maven Profile

```xml
<!-- In pom.xml -->
<profiles>
    <profile>
        <id>prod</id>
        <properties>
            <spring.profiles.active>prod</spring.profiles.active>
        </properties>
        <build>
            <plugins>
                <plugin>
                    <groupId>org.springframework.boot</groupId>
                    <artifactId>spring-boot-maven-plugin</artifactId>
                    <configuration>
                        <executable>true</executable>
                    </configuration>
                </plugin>
            </plugins>
        </build>
    </profile>
</profiles>
```

## Docker Deployment

### Optimized Dockerfile

```dockerfile
# Multi-stage build for smaller image
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app
COPY pom.xml .
COPY src ./src

# Build application
RUN mvn clean package -DskipTests

# Production stage
FROM eclipse-temurin:17-jre-alpine

# Create non-root user
RUN addgroup -S inteko && adduser -S inteko -G inteko

WORKDIR /app

# Copy JAR from builder
COPY --from=builder /app/target/inteko-backend-*.jar app.jar

# Change ownership
RUN chown -R inteko:inteko /app

# Switch to non-root user
USER inteko

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/v1/actuator/health || exit 1

EXPOSE 8080

ENTRYPOINT ["java", \
    "-XX:+UseContainerSupport", \
    "-XX:MaxRAMPercentage=75.0", \
    "-Djava.security.egd=file:/dev/./urandom", \
    "-jar", "app.jar"]
```

### Docker Compose for Production

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: inteko-postgres-prod
    restart: always
    environment:
      POSTGRES_DB: ${DATABASE_NAME}
      POSTGRES_USER: ${DATABASE_USERNAME}
      POSTGRES_PASSWORD: ${DATABASE_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    ports:
      - "5432:5432"
    networks:
      - inteko-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DATABASE_USERNAME}"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: inteko-backend-prod
    restart: always
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      SPRING_PROFILES_ACTIVE: prod
      DATABASE_URL: jdbc:postgresql://postgres:5432/${DATABASE_NAME}
      DATABASE_USERNAME: ${DATABASE_USERNAME}
      DATABASE_PASSWORD: ${DATABASE_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      ALLOWED_ORIGINS: ${ALLOWED_ORIGINS}
    ports:
      - "8080:8080"
    networks:
      - inteko-network
    volumes:
      - ./logs:/var/log/inteko
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:8080/api/v1/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s

  nginx:
    image: nginx:alpine
    container_name: inteko-nginx
    restart: always
    depends_on:
      - backend
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - ./logs/nginx:/var/log/nginx
    networks:
      - inteko-network

volumes:
  postgres_data:

networks:
  inteko-network:
    driver: bridge
```

### Nginx Configuration

```nginx
# nginx/nginx.conf
upstream backend {
    server backend:8080;
}

server {
    listen 80;
    server_name inteko.gov.rw www.inteko.gov.rw;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name inteko.gov.rw www.inteko.gov.rw;
    
    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/certificate.crt;
    ssl_certificate_key /etc/nginx/ssl/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Logging
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;
    
    # Backend API
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Buffers
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
        proxy_busy_buffers_size 8k;
    }
    
    # Health Check
    location /health {
        proxy_pass http://backend/api/v1/actuator/health;
    }
}
```

## Cloud Deployment Options

### AWS Deployment

#### 1. AWS Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize EB
eb init -p docker inteko-backend

# Create environment
eb create inteko-prod

# Deploy
eb deploy

# View logs
eb logs

# Set environment variables
eb setenv DATABASE_URL=xxx JWT_SECRET=xxx
```

#### 2. AWS ECS (Elastic Container Service)

```yaml
# ecs-task-definition.json
{
  "family": "inteko-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "inteko-backend",
      "image": "your-ecr-repo/inteko-backend:latest",
      "portMappings": [
        {
          "containerPort": 8080,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "SPRING_PROFILES_ACTIVE",
          "value": "prod"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_PASSWORD",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:db-password"
        },
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:jwt-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/inteko-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### Heroku Deployment

```bash
# Login to Heroku
heroku login

# Create app
heroku create inteko-backend-prod

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:standard-0

# Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set SPRING_PROFILES_ACTIVE=prod

# Deploy
git push heroku main

# Run migrations
heroku run java -jar target/inteko-backend.jar --spring.flyway.migrate

# View logs
heroku logs --tail

# Scale dynos
heroku ps:scale web=2
```

### DigitalOcean App Platform

```yaml
# .do/app.yaml
name: inteko-backend
region: nyc
services:
  - name: api
    github:
      repo: your-org/inteko-backend
      branch: main
      deploy_on_push: true
    build_command: mvn clean package -DskipTests
    run_command: java -jar target/inteko-backend-*.jar
    environment_slug: java
    instance_count: 2
    instance_size_slug: professional-xs
    http_port: 8080
    routes:
      - path: /
    envs:
      - key: SPRING_PROFILES_ACTIVE
        value: prod
      - key: DATABASE_URL
        value: ${db.DATABASE_URL}
      - key: JWT_SECRET
        value: ${JWT_SECRET}
        type: SECRET

databases:
  - name: db
    engine: PG
    version: "15"
    size: db-s-1vcpu-1gb
```

## Database Migration

### Production Migration Strategy

```bash
# 1. Backup current database
pg_dump -U username -h host dbname > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Test migrations on staging
mvn flyway:migrate -Dflyway.url=jdbc:postgresql://staging-db:5432/inteko_staging

# 3. Run production migrations (during maintenance window)
mvn flyway:migrate -Dflyway.url=jdbc:postgresql://prod-db:5432/inteko_prod

# 4. Verify migration
mvn flyway:info
```

### Automated Backup Script

```bash
#!/bin/bash
# backup-db.sh

BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/inteko_backup_$TIMESTAMP.sql"

# Create backup
pg_dump -U $DATABASE_USERNAME -h $DATABASE_HOST $DATABASE_NAME > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

# Upload to S3 (optional)
aws s3 cp $BACKUP_FILE.gz s3://inteko-backups/

# Delete backups older than 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_FILE.gz"
```

### Cron Job for Automated Backups

```cron
# Run daily at 2 AM
0 2 * * * /path/to/backup-db.sh >> /var/log/inteko/backup.log 2>&1
```

## Monitoring & Logging

### Application Monitoring with Spring Boot Actuator

```yaml
# application-prod.yml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
      base-path: /actuator
  endpoint:
    health:
      show-details: when-authorized
  metrics:
    export:
      prometheus:
        enabled: true
```

### Prometheus Configuration

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'inteko-backend'
    metrics_path: '/api/v1/actuator/prometheus'
    static_configs:
      - targets: ['backend:8080']
```

### Log Aggregation

#### Using ELK Stack
```yaml
# filebeat.yml
filebeat.inputs:
  - type: log
    paths:
      - /var/log/inteko/backend.log
    fields:
      service: inteko-backend
      environment: production

output.elasticsearch:
  hosts: ["elasticsearch:9200"]
```

## SSL Certificate Setup

### Let's Encrypt with Certbot

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d inteko.gov.rw -d www.inteko.gov.rw

# Auto-renewal (cron)
0 0 * * * certbot renew --quiet
```

## Performance Optimization

### JVM Tuning

```bash
java -Xms512m -Xmx2g \
  -XX:+UseG1GC \
  -XX:MaxGCPauseMillis=200 \
  -XX:+HeapDumpOnOutOfMemoryError \
  -XX:HeapDumpPath=/var/log/inteko/heapdump.hprof \
  -jar inteko-backend.jar
```

### Database Connection Pooling

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000
      leak-detection-threshold: 60000
```

## Rollback Strategy

```bash
# 1. Stop current version
docker-compose down

# 2. Restore database backup (if needed)
psql -U username -h host dbname < backup_file.sql

# 3. Deploy previous version
git checkout tags/v1.0.0
docker-compose up -d

# 4. Verify application
curl https://inteko.gov.rw/api/v1/actuator/health
```

## Post-Deployment Verification

```bash
# Health check
curl https://inteko.gov.rw/api/v1/actuator/health

# Test authentication
curl -X POST https://inteko.gov.rw/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.rw","password":"password"}'

# Check database connectivity
docker exec inteko-postgres-prod psql -U inteko_user -d inteko_db -c "SELECT 1;"

# View logs
docker logs inteko-backend-prod --tail 100

# Monitor resource usage
docker stats
```

## Disaster Recovery Plan

1. **Regular Backups**: Daily automated backups
2. **Multi-Region**: Deploy in multiple availability zones
3. **Database Replication**: Set up read replicas
4. **Failover Strategy**: Automatic failover to standby instance
5. **Recovery Time Objective (RTO)**: < 1 hour
6. **Recovery Point Objective (RPO)**: < 15 minutes

## Security Hardening

- [ ] Enable HTTPS only
- [ ] Set up Web Application Firewall (WAF)
- [ ] Configure rate limiting
- [ ] Enable database encryption at rest
- [ ] Implement IP whitelisting for admin endpoints
- [ ] Regular security audits
- [ ] Keep dependencies updated
- [ ] Use secrets management (AWS Secrets Manager, HashiCorp Vault)

## Maintenance Window

Recommended schedule:
- **Daily**: Automated backups at 2 AM
- **Weekly**: Security updates (Sunday 2-4 AM)
- **Monthly**: Major updates (First Sunday 2-5 AM)

## Support & Troubleshooting

### Common Issues

**Database Connection Timeout**
```bash
# Check database connectivity
docker exec -it inteko-postgres-prod psql -U inteko_user -d inteko_db

# Restart database
docker-compose restart postgres
```

**Out of Memory**
```bash
# Increase JVM memory
export JAVA_OPTS="-Xmx2g"

# Check memory usage
docker stats inteko-backend-prod
```

**High CPU Usage**
```bash
# Profile application
docker exec inteko-backend-prod jstack 1 > thread_dump.txt

# Check slow queries
psql -U inteko_user -c "SELECT * FROM pg_stat_activity WHERE state = 'active';"
```

## Conclusion

Your backend is now ready for production! Monitor regularly and follow best practices for security and performance.

For support: backend-support@inteko.gov.rw
