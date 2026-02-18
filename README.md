# Task Suite

A comprehensive task management application with real-time updates and push notifications.

![Dashboard](docs/images/dashboard.webp)

## Features

-   **Task Management**: Create, edit, delete, and organize tasks with priority levels.
-   **Reminders**: Set one-time or recurring reminders.
    -   **Real-time**: Instant in-app notifications via WebSocket.
    -   **Web Push**: **NEW** Background notifications via Web Push API (works even when tab is closed).
-   **Notes**: Keep track of quick notes and ideas.
-   **Pomodoro Timer**: Native timer for productivity sessions.
-   **Dark Mode**: Sleek, modern dark UI.
-   **Authentication**: Secure JWT-based login and signup.

## Technology Stack

-   **Backend**: Java 21, Spring Boot 3.5.3, Spring Security (JWT), Spring WebSocket (Stomp), Web Push (VAPID).
-   **Frontend**: Next.js 14, React, Tailwind CSS (or SCSS modules), SockJS, Lucide React.
-   **Infrastructure**: Docker, PostgreSQL, Redis, Kafka, Zookeeper.

## Setup & Installation

### Prerequisites
-   Java 21+
-   Node.js 18+
-   Docker Desktop

### Quick Start (Single Command)

We have provided a PowerShell script to start everything (Docker + Backend + Frontend) in one go:

```powershell
.\start_app.ps1
```

### Manual Setup

Start the required services (Postgres, Redis, Kafka, Zookeeper) using Docker:

```powershell
docker-compose up -d
```

### 2. Backend Setup

```powershell
cd backend
mvn spring-boot:run
```

The server will start on `http://localhost:8080`.
Flyway will automatically migrate the database schema on startup.

### 3. Frontend Setup

```powershell
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:3000`.

### 4. Web Push Configuration (VAPID) [Included]

The application uses the Web Push API. VAPID keys are configured in `backend/src/main/resources/application.properties`.

To generate new keys (optional):
```bash
npx web-push generate-vapid-keys
```
Then update `webpush.vapid.public-key` and `webpush.vapid.private-key` in `application.properties`.
The public key is also fetched automatically by the frontend.

## Usage

1.  **Sign Up/Login**: Create an account.
2.  **Enable Notifications**: You will be prompted to allow notifications on first login.
3.  **Create Tasks/Reminders**: Add items to your list.
4.  **Receive Push**: Notifications will appear on your device even if the browser is closed (requires HTTPS in production or localhost).

## Screenshots

### Login Screen
![Login](docs/images/login.webp)

### Dashboard
![Dashboard](docs/images/dashboard.webp)