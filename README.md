# Calendar App

A calendar application with task management and worldwide public holiday display.

## Tech Stack

**Frontend:** React, TypeScript, Emotion, Vite

**Backend:** Node.js, Express, MongoDB, TypeScript

**Infrastructure:** Docker (MongoDB)

## Project Structure

```
├── src/                        # Frontend (React)
│   ├── api/                    # API clients (tasks, holidays)
│   ├── components/             # UI components
│   │   └── calendar/           # CalendarGrid, DayCell, DayTaskList
│   ├── domain/                 # Types and constants
│   ├── store/task/             # Task state management (useReducer)
│   ├── styles/                 # Styled components
│   └── utils/                  # Date helpers, grouping utilities
│
├── server/                     # Backend (Express)
│   └── src/
│       ├── routes/             # HTTP layer
│       ├── service/            # Business logic
│       ├── repository/         # MongoDB operations
│       └── types/              # Shared types
│
└── infrastructure/dev/         # Docker Compose for MongoDB
```

## Getting Started

### Prerequisites

- Node.js 18+
- Docker

### 1. Start MongoDB

```bash
cd infrastructure/dev
docker compose up -d
```

### 2. Set up the backend

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

The server starts on `http://localhost:3001`.

### 3. Start the frontend

```bash
npm install
npm run dev
```

The app opens on `http://localhost:5173`.

## Features

- Monthly calendar view with navigation
- Create, edit, delete, and reorder tasks per day
- Drag and drop tasks between days
- Search tasks by title
- Holiday display modes:
  - **Worldwide holidays** - aggregated from all countries, cached in the database
  - **Nearest holidays** - upcoming holidays worldwide (live from Nager.Date API)
  - **Per-country holidays** - select a specific country from the dropdown
  - **Tasks only** - hide holidays

## API Endpoints

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get tasks |
| POST | `/api/tasks` | Create a task |
| PATCH | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

### Holidays

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/holidays/worldwide?year=2026` | Get worldwide holidays for a year |

## Scripts

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |

### Backend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |

## Environment Variables

See `server/.env.example`:

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGODB_URI` | `mongodb://admin:password@localhost:27017` | MongoDB connection string |
| `DB_NAME` | `calendar` | Database name |
| `PORT` | `3001` | Server port |
