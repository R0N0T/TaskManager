# Frontend Guide

## Project Structure
```text
app/
├── (auth)/          # Login/Signup pages (Route Group)
├── (dashboard)/     # Protected pages (Layout with Sidebar)
│   ├── kanban/
│   ├── profile/
│   ├── settings/
│   └── ...
├── components/      # Reusable UI components
│   ├── kanban/      # Kanban-specific components
│   └── ...
├── context/         # React Context (AuthContext)
├── utils/           # Helpers (apiClient.js)
└── globals.css      # Global styles & variables
```

## State Management
-   **AuthContext**: Manages `user`, `token`, and login/logout functions. Persists token to `localStorage`.
-   **Local State**: `useState` is used for component-level state (e.g., Kanban tasks).
-   **Real-time**: `useEffect` in `KanbanBoard.jsx` connects to WebSocket and updates local state when messages arrive.

## Styling
-   **Global Variables**: Defined in `globals.css` (CSS Variables for standard colors/spacing).
-   **CSS Modules**: Used for complex components (e.g., `Kanban.module.scss`) to scope styles.
-   **Tailwind CSS**: Used for utility classes in some components.

## Routing
-   Next.js 14 App Router.
-   **Route Groups**:
    -   `(auth)`: Layout without sidebar.
    -   `(dashboard)`: Layout WITH sidebar and TopBar.
    -   `middleware.js` (Optional/Future): Can be added to protect routes server-side.
