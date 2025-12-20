FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy the built jar
COPY target/taskmanager-0.0.1-SNAPSHOT.jar app.jar

# Expose Spring Boot port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
