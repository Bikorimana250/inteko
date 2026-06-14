# Java 25 Compatibility Note

## Current Status

✅ **Project compiles successfully with Java 25**

The project has been configured to:
- Use Java 21 bytecode target (compatible with Java 21-25)
- Remove Lombok annotation processing (temporarily) 
- Use Maven Compiler Plugin 3.13.0

## About Lombok

Lombok support has been **temporarily removed** from the annotation processors because:
- Lombok 1.18.34 doesn't support Java 25 yet
- Lombok edge releases require additional configuration
- The project foundation doesn't use Lombok yet (only enum classes)

### When You Need Lombok

When you start implementing entities (Phase 2), you have two options:

**Option 1: Use Java 21 (Recommended for Production)**
```bash
# Download Java 21 LTS from:
# https://www.oracle.com/java/technologies/downloads/#java21

# Set JAVA_HOME to Java 21
# Then add Lombok back to pom.xml annotation processors
```

**Option 2: Wait for Lombok Java 25 Support**
- Monitor: https://github.com/projectlombok/lombok/issues
- Lombok edge releases may add Java 25 support soon
- Or manually write getters/setters instead of using Lombok

**Option 3: Skip Lombok**
- Use regular Java getters/setters
- Use Java Records for immutable DTOs
- Modern IDEs generate these automatically

## Build Commands

```bash
# Clean and compile
mvn clean compile

# Package application
mvn clean package

# Run tests
mvn test

# Run application
mvn spring-boot:run
```

## Recommendation for Development

For the smoothest experience:
1. **Install Java 21 LTS** alongside Java 25
2. Set JAVA_HOME to Java 21 for this project
3. Re-enable Lombok in pom.xml
4. Full annotation processing will work perfectly

Java 21 is the current LTS version and has full ecosystem support.

## Current Build Configuration

```xml
<properties>
    <java.version>21</java.version>
    <maven.compiler.source>21</maven.compiler.source>
    <maven.compiler.target>21</maven.compiler.target>
    <maven.compiler.release>21</maven.compiler.release>
</properties>

<!-- Lombok temporarily disabled in annotation processors -->
<!-- MapStruct temporarily disabled -->
<!-- Can be re-enabled when using Java 21 -->
```

Your code will run perfectly on Java 25 runtime while targeting Java 21 bytecode!
