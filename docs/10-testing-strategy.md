# Testing Strategy

## Overview

This document outlines the testing approach for the Inteko backend, including unit tests, integration tests, and API tests.

## Testing Pyramid

```
           /\
          /  \  E2E Tests (Few)
         /----\
        /      \  Integration Tests (Some)
       /--------\
      /          \  Unit Tests (Many)
     /____________\
```

## Test Dependencies

```xml
<!-- In pom.xml -->
<dependencies>
    <!-- Spring Boot Test -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
    
    <!-- Spring Security Test -->
    <dependency>
        <groupId>org.springframework.security</groupId>
        <artifactId>spring-security-test</artifactId>
        <scope>test</scope>
    </dependency>
    
    <!-- TestContainers for DB Integration Tests -->
    <dependency>
        <groupId>org.testcontainers</groupId>
        <artifactId>testcontainers</artifactId>
        <version>1.19.3</version>
        <scope>test</scope>
    </dependency>
    
    <dependency>
        <groupId>org.testcontainers</groupId>
        <artifactId>postgresql</artifactId>
        <version>1.19.3</version>
        <scope>test</scope>
    </dependency>
    
    <dependency>
        <groupId>org.testcontainers</groupId>
        <artifactId>junit-jupiter</artifactId>
        <version>1.19.3</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

## Unit Tests

### Repository Layer Tests

```java
package rw.gov.inteko.backend.repository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import rw.gov.inteko.backend.entity.User;
import rw.gov.inteko.backend.entity.enums.UserRole;
import rw.gov.inteko.backend.entity.enums.UserStatus;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class UserRepositoryTest {
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Autowired
    private UserRepository userRepository;
    
    private User testUser;
    
    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .userCode("U-TEST-001")
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@test.rw")
                .passwordHash("hashed_password")
                .idNumber("1234567890123456")
                .phone("+250 788 123 456")
                .role(UserRole.ADMINISTRATOR)
                .permissions("Level 3 (Full Control)")
                .status(UserStatus.ACTIVE)
                .build();
        
        entityManager.persist(testUser);
        entityManager.flush();
    }
    
    @Test
    void whenFindByEmail_thenReturnUser() {
        // when
        Optional<User> found = userRepository.findByEmail(testUser.getEmail());
        
        // then
        assertThat(found).isPresent();
        assertThat(found.get().getEmail()).isEqualTo(testUser.getEmail());
    }
    
    @Test
    void whenFindByInvalidEmail_thenReturnEmpty() {
        // when
        Optional<User> found = userRepository.findByEmail("invalid@test.rw");
        
        // then
        assertThat(found).isEmpty();
    }
    
    @Test
    void whenExistsByEmail_thenReturnTrue() {
        // when
        boolean exists = userRepository.existsByEmail(testUser.getEmail());
        
        // then
        assertThat(exists).isTrue();
    }
    
    @Test
    void whenFindByRole_thenReturnUsers() {
        // when
        var users = userRepository.findByRole(UserRole.ADMINISTRATOR);
        
        // then
        assertThat(users).hasSize(1);
        assertThat(users.get(0).getRole()).isEqualTo(UserRole.ADMINISTRATOR);
    }
    
    @Test
    void whenCountByStatus_thenReturnCorrectCount() {
        // when
        Long count = userRepository.countByStatus(UserStatus.ACTIVE);
        
        // then
        assertThat(count).isEqualTo(1L);
    }
}
```

### Service Layer Tests

```java
package rw.gov.inteko.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import rw.gov.inteko.backend.dto.request.CreateUserRequest;
import rw.gov.inteko.backend.dto.response.UserResponse;
import rw.gov.inteko.backend.entity.User;
import rw.gov.inteko.backend.entity.enums.UserRole;
import rw.gov.inteko.backend.entity.enums.UserStatus;
import rw.gov.inteko.backend.exception.DuplicateResourceException;
import rw.gov.inteko.backend.exception.ResourceNotFoundException;
import rw.gov.inteko.backend.mapper.UserMapper;
import rw.gov.inteko.backend.repository.*;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private SectorRepository sectorRepository;
    
    @Mock
    private CellRepository cellRepository;
    
    @Mock
    private VillageRepository villageRepository;
    
    @Mock
    private PasswordEncoder passwordEncoder;
    
    @Mock
    private UserMapper userMapper;
    
    @InjectMocks
    private UserService userService;
    
    private CreateUserRequest createRequest;
    private User user;
    private UserResponse userResponse;
    
    @BeforeEach
    void setUp() {
        createRequest = new CreateUserRequest();
        createRequest.setFirstName("John");
        createRequest.setLastName("Doe");
        createRequest.setEmail("john.doe@test.rw");
        createRequest.setPassword("password123");
        createRequest.setIdNumber("1234567890123456");
        createRequest.setPhone("+250 788 123 456");
        createRequest.setRole(UserRole.ADMINISTRATOR);
        createRequest.setPermissions("Level 3");
        
        user = User.builder()
                .id(1L)
                .userCode("U-001")
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@test.rw")
                .passwordHash("hashed_password")
                .role(UserRole.ADMINISTRATOR)
                .status(UserStatus.ACTIVE)
                .build();
        
        userResponse = UserResponse.builder()
                .id(1L)
                .userCode("U-001")
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@test.rw")
                .role(UserRole.ADMINISTRATOR)
                .build();
    }
    
    @Test
    void whenCreateUser_thenSuccess() {
        // given
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userRepository.existsByIdNumber(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashed_password");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(userMapper.toResponse(any(User.class))).thenReturn(userResponse);
        
        // when
        UserResponse result = userService.createUser(createRequest);
        
        // then
        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo("john.doe@test.rw");
        verify(userRepository, times(1)).save(any(User.class));
    }
    
    @Test
    void whenCreateUserWithDuplicateEmail_thenThrowException() {
        // given
        when(userRepository.existsByEmail(anyString())).thenReturn(true);
        
        // when & then
        assertThatThrownBy(() -> userService.createUser(createRequest))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessageContaining("Email already exists");
        
        verify(userRepository, never()).save(any(User.class));
    }
    
    @Test
    void whenGetUserById_thenReturnUser() {
        // given
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userMapper.toResponse(any(User.class))).thenReturn(userResponse);
        
        // when
        UserResponse result = userService.getUserById(1L);
        
        // then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
    }
    
    @Test
    void whenGetUserByInvalidId_thenThrowException() {
        // given
        when(userRepository.findById(999L)).thenReturn(Optional.empty());
        
        // when & then
        assertThatThrownBy(() -> userService.getUserById(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User not found");
    }
    
    @Test
    void whenToggleUserStatus_thenStatusChanged() {
        // given
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);
        
        // when
        userService.toggleUserStatus(1L);
        
        // then
        verify(userRepository, times(1)).save(any(User.class));
    }
}
```

## Integration Tests

### Controller Integration Tests

```java
package rw.gov.inteko.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import rw.gov.inteko.backend.dto.request.CreateUserRequest;
import rw.gov.inteko.backend.entity.enums.UserRole;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class UserControllerIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Test
    @WithMockUser(roles = "ADMINISTRATOR")
    void whenCreateUser_thenReturns201() throws Exception {
        // given
        CreateUserRequest request = new CreateUserRequest();
        request.setFirstName("Test");
        request.setLastName("User");
        request.setEmail("test.user@test.rw");
        request.setPassword("password123");
        request.setIdNumber("1234567890123456");
        request.setPhone("+250 788 123 456");
        request.setRole(UserRole.MEETING_SECRETARY);
        request.setPermissions("Level 1");
        
        // when & then
        mockMvc.perform(post("/api/v1/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value("test.user@test.rw"));
    }
    
    @Test
    @WithMockUser(roles = "MEETING_SECRETARY")
    void whenCreateUserWithoutAdminRole_thenReturns403() throws Exception {
        // given
        CreateUserRequest request = new CreateUserRequest();
        request.setEmail("test@test.rw");
        
        // when & then
        mockMvc.perform(post("/api/v1/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }
    
    @Test
    @WithMockUser
    void whenGetAllUsers_thenReturns200() throws Exception {
        mockMvc.perform(get("/api/v1/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray());
    }
    
    @Test
    void whenGetAllUsersWithoutAuth_thenReturns401() throws Exception {
        mockMvc.perform(get("/api/v1/users"))
                .andExpect(status().isUnauthorized());
    }
}
```

### Database Integration Tests with TestContainers

```java
package rw.gov.inteko.backend.integration;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import rw.gov.inteko.backend.entity.User;
import rw.gov.inteko.backend.entity.enums.UserRole;
import rw.gov.inteko.backend.entity.enums.UserStatus;
import rw.gov.inteko.backend.repository.UserRepository;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Testcontainers
class DatabaseIntegrationTest {
    
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine")
            .withDatabaseName("inteko_test")
            .withUsername("test")
            .withPassword("test");
    
    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }
    
    @Autowired
    private UserRepository userRepository;
    
    @Test
    void whenSaveUser_thenCanRetrieve() {
        // given
        User user = User.builder()
                .userCode("U-TEST-001")
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@test.rw")
                .passwordHash("hashed")
                .idNumber("1234567890123456")
                .phone("+250 788 123 456")
                .role(UserRole.ADMINISTRATOR)
                .permissions("Level 3")
                .status(UserStatus.ACTIVE)
                .build();
        
        // when
        User saved = userRepository.save(user);
        User retrieved = userRepository.findById(saved.getId()).orElseThrow();
        
        // then
        assertThat(retrieved.getEmail()).isEqualTo("john.doe@test.rw");
        assertThat(retrieved.getCreatedAt()).isNotNull();
    }
}
```

## Authentication Tests

```java
package rw.gov.inteko.backend.security;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import rw.gov.inteko.backend.dto.request.LoginRequest;
import rw.gov.inteko.backend.dto.response.AuthResponse;
import rw.gov.inteko.backend.entity.User;
import rw.gov.inteko.backend.entity.enums.UserRole;
import rw.gov.inteko.backend.mapper.UserMapper;
import rw.gov.inteko.backend.repository.UserRepository;
import rw.gov.inteko.backend.service.AuthService;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {
    
    @Mock
    private AuthenticationManager authenticationManager;
    
    @Mock
    private JwtTokenProvider tokenProvider;
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private UserMapper userMapper;
    
    @InjectMocks
    private AuthService authService;
    
    @Test
    void whenLogin_thenReturnAuthResponse() {
        // given
        LoginRequest request = new LoginRequest();
        request.setEmail("test@test.rw");
        request.setPassword("password");
        
        User user = User.builder()
                .id(1L)
                .email("test@test.rw")
                .passwordHash("hashed")
                .role(UserRole.ADMINISTRATOR)
                .build();
        
        UserPrincipal principal = UserPrincipal.create(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        
        when(authenticationManager.authenticate(any())).thenReturn(authentication);
        when(tokenProvider.generateToken(any())).thenReturn("access_token");
        when(tokenProvider.generateRefreshToken(any())).thenReturn("refresh_token");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        
        // when
        AuthResponse response = authService.login(request);
        
        // then
        assertThat(response.getAccessToken()).isEqualTo("access_token");
        assertThat(response.getRefreshToken()).isEqualTo("refresh_token");
        assertThat(response.getTokenType()).isEqualTo("Bearer");
        verify(userRepository, times(1)).save(any(User.class));
    }
}
```

## Test Configuration

```java
package rw.gov.inteko.backend.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@TestConfiguration
public class TestConfig {
    
    @Bean
    @Primary
    public PasswordEncoder testPasswordEncoder() {
        return new BCryptPasswordEncoder(4); // Lower rounds for faster tests
    }
}
```

## Test Coverage

### Minimum Coverage Targets
- **Overall**: 80%
- **Service Layer**: 90%
- **Repository Layer**: 85%
- **Controller Layer**: 75%

### Running Tests with Coverage

```bash
# Run all tests
mvn test

# Run tests with coverage report
mvn test jacoco:report

# View coverage report
open target/site/jacoco/index.html
```

## Testing Best Practices

1. **Follow AAA Pattern**: Arrange, Act, Assert
2. **Use Meaningful Test Names**: `whenCondition_thenExpectedResult()`
3. **Test One Thing Per Test**: Single responsibility
4. **Use Test Data Builders**: For complex objects
5. **Mock External Dependencies**: Database, APIs, etc.
6. **Clean Up After Tests**: Use `@Transactional` or explicit cleanup
7. **Use AssertJ**: For fluent assertions
8. **Test Edge Cases**: Null values, empty lists, boundary conditions
9. **Integration Tests for Critical Flows**: Authentication, payment, etc.
10. **Keep Tests Fast**: < 1 second for unit tests

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'
      
      - name: Run tests
        run: mvn clean test
      
      - name: Generate coverage report
        run: mvn jacoco:report
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
```

## Next Steps

→ `11-deployment-guide.md` - Deploy to production
