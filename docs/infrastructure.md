# Infrastructure Guide

## Docker Compose
The `docker-compose.yml` file orchestrates the entire infrastructure.

### Services
1.  **PostgreSQL (`taskmanager-db`)**
    -   Port: `5432`
    -   Volume: `postgres_data` (Persistence)
2.  **Redis (`taskmanager-redis`)**
    -   Port: `6379`
    -   Usage: Caching and Session management (future).
3.  **Zookeeper (`taskmanager-zookeeper`)**
    -   Port: `2181`
    -   Required by Kafka.
4.  **Kafka (`taskmanager-kafka`)**
    -   Port: `9092`
    -   Usage: Event streaming for notifications.

## Management Commands

### Start All
```powershell
# Using the helper script
.\start_app.ps1
```
Or manually:
```powershell
docker-compose up -d
```

### Stop All
```powershell
docker-compose down
```

### View Logs
```powershell
docker logs -f taskmanager-db
docker logs -f taskmanager-kafka
```

### Reset Database
To completely wipe the database (WARNING: Destructive):
1.  `docker-compose down`
2.  `docker volume rm taskmanager_postgres_data`
3.  `docker-compose up -d`
