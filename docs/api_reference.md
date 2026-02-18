# API Reference

Base URL: `http://localhost:8080/api`

## Authentication
| Method | Endpoint | Description | Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Register new user | `{ username, password, email }` |
| `POST` | `/auth/login` | Login user | `{ username, password }` |

## Tasks
| Method | Endpoint | Description | Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/tasks` | Get all tasks for user | - |
| `POST` | `/tasks` | Create task | `{ title, description, status, priority, dueDate }` |
| `PUT` | `/tasks/{id}` | Update task | `{ title, description, status, priority }` |
| `PATCH`| `/tasks/{id}/status` | Update status only | `{ status: "DONE" }` |
| `DELETE`| `/tasks/{id}` | Delete task | - |

## Habits
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/habits` | Get all habits |
| `POST` | `/habits` | Create habit |
| `POST` | `/habits/{id}/toggle` | Toggle completion for today |

## Notes
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/notes` | Get all notes |
| `POST` | `/notes` | Create note |
| `PUT` | `/notes/{id}` | Update note |

## Pomodoro
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/pomodoro/sessions` | Save a completed session | `{ duration: 25 }` |
| `GET` | `/pomodoro/stats` | Get total focus time |
