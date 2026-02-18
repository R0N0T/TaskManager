# Backend Guide

## Project Structure
```text
src/main/java/com/example/taskmanager/
├── config/          # Security, WebSocket, CORS, Kafka configs
├── controller/      # REST Controllers (API endpoints)
├── model/           # JPA Entities (Task, User, Reminder, etc.)
├── repository/      # Spring Data JPA Repositories
├── service/         # Business Logic
└── util/            # Helper classes (JwtUtil)
```

## Security (JWT)
The application uses **Stateless JWT Authentication**.
-   **JwtAuthFilter**: Intercepts every request, extracts the "Authorization" header (`Bearer <token>`), and validates it using `JwtUtil`.
-   **SecurityConfig**: Defines public endpoints (`/auth/**`, `/ws/**`) and secures all others.

## Database Migration (Flyway)
We use Flyway for schema versioning.
-   Location: `src/main/resources/db/migration`
-   Values: `V1__init.sql` contains the initial schema.
-   **Rule**: Never modify an existing migration file after it has been applied. Create `V2__...` for changes.

## WebSocket (Real-time)
-   **Endpoint**: `/ws` (SockJS + STOMP)
-   **Topic**: `/topic/tasks/{userId}`
-   **Flow**: When a task is created/updated, `TaskService` broadcasts the updated entity to this topic. The Frontend subscribes to it and updates React state instantly.

## Kafka Integration
-   **Producer**: Sends messages to `notification-topic`.
-   **Consumer**: Listens to topics and triggers `WebPushService` to send browser notifications.
