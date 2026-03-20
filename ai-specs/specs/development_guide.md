# Development Guide

This guide provides step-by-step instructions for setting up the development environment and running the FastReport application.

## Prerequisites

Ensure you have the following installed:
- **Python** >= 3.12
- **Node.js** >= 18 (with npm)
- **Docker** and **Docker Compose**
- **Git**

## Environment Configuration

### Backend Environment

Create `backend/.env` (or use environment variables):

```env
DATABASE_URL=postgresql+asyncpg://appuser:apppassword@localhost:5432/appdb
SECRET_KEY=changeme
CORS_ORIGINS=["http://localhost:5173"]
```

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL async connection string | `postgresql+asyncpg://appuser:apppassword@localhost:5432/appdb` |
| `SECRET_KEY` | JWT secret key (not yet used) | `changeme` |
| `CORS_ORIGINS` | JSON array of allowed origins | `["http://localhost:5173"]` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiry (not yet used) | `30` |

### Frontend Environment

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8000` |

A `.env.example` file is provided as a reference.

## Quick Start with Docker Compose

The fastest way to run the entire stack:

```bash
# Start all services (PostgreSQL, backend, frontend)
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

Services will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **PostgreSQL**: localhost:5432

The backend entrypoint automatically:
1. Checks for existing database state
2. Runs `alembic upgrade head` (migrations)
3. Starts Uvicorn on port 8000

## Manual Setup (Local Development)

### 1. Start the Database

```bash
# Start only PostgreSQL
docker-compose up -d db

# Verify it's healthy
docker-compose ps
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # On macOS/Linux

# Install dependencies (including dev tools)
pip install -e ".[dev]"

# Run database migrations
alembic upgrade head

# (Optional) Seed with sample data
python scripts/seed_companies.py

# Start development server with hot reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at http://localhost:8000.
API docs (Swagger UI): http://localhost:8000/docs

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at http://localhost:5173.

## Running Tests

### Backend Tests

```bash
cd backend

# Ensure test database exists (uses appdb_test)
# The test fixtures create/drop tables automatically

# Run all tests
pytest

# Run with verbose output
pytest -v

# Run specific test file
pytest tests/unit/domain/test_company.py

# Run with coverage
pytest --cov=app

# Run only unit tests
pytest tests/unit/

# Run only integration tests
pytest tests/integration/
```

**Test database:** Tests use `appdb_test` (configured in `tests/conftest.py`). The `setup_database` fixture creates all tables before the test session and drops them after.

### Frontend Tests (Cypress E2E)

```bash
cd frontend

# Prerequisite: backend and frontend must be running

# Interactive mode (Cypress Test Runner)
npx cypress open

# Headless mode
npx cypress run
```

**Cypress configuration:**
- Base URL: `http://localhost:5173`
- API URL: `http://localhost:8000` (environment variable)
- Viewport: 1280x720

## Database Migrations

```bash
cd backend

# Apply all pending migrations
alembic upgrade head

# Create a new migration (auto-detect model changes)
alembic revision --autogenerate -m "descriptive_migration_name"

# Downgrade one version
alembic downgrade -1

# Show current migration version
alembic current

# Show migration history
alembic history
```

## Linting and Type Checking

### Backend

```bash
cd backend

# Lint check
ruff check .

# Auto-fix lint issues
ruff check --fix .

# Format code
ruff format .

# Type check (strict mode)
mypy app/
```

### Frontend

```bash
cd frontend

# Lint
npm run lint

# Type check
npx tsc --noEmit
```

## Build for Production

### Backend

The backend runs directly from source via Uvicorn. The Dockerfile handles production builds:

```bash
# Build Docker image
docker build -t fastreport-backend ./backend
```

### Frontend

```bash
cd frontend

# Type check + build
npm run build

# Preview the production build
npm run preview
```

Output goes to `frontend/dist/`.

## Project Scripts Reference

### Backend (via pip/python)

| Command | Description |
|---------|-------------|
| `pip install -e ".[dev]"` | Install with dev dependencies |
| `uvicorn app.main:app --reload` | Dev server with hot reload |
| `pytest` | Run all tests |
| `pytest --cov=app` | Tests with coverage |
| `ruff check .` | Lint |
| `ruff format .` | Format |
| `mypy app/` | Type check |
| `alembic upgrade head` | Apply migrations |
| `alembic revision --autogenerate -m "name"` | Create migration |
| `python scripts/seed_companies.py` | Seed database |

### Frontend (via npm)

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server (port 5173) |
| `npm run build` | Production build (`tsc && vite build`) |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npx cypress open` | Cypress interactive |
| `npx cypress run` | Cypress headless |

### Docker Compose

| Command | Description |
|---------|-------------|
| `docker-compose up -d` | Start all services |
| `docker-compose up -d db` | Start only database |
| `docker-compose down` | Stop all services |
| `docker-compose down -v` | Stop and remove volumes |
| `docker-compose logs -f <service>` | Follow logs |
| `docker-compose ps` | Check service status |

## Architecture Overview

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │────▶│   Backend    │────▶│  PostgreSQL  │
│  React/Vite  │     │   FastAPI    │     │    16-alpine │
│  port 5173   │     │  port 8000   │     │  port 5432   │
└──────────────┘     └──────────────┘     └──────────────┘
```

The frontend communicates with the backend via REST API (axios). The backend uses SQLAlchemy async with asyncpg to communicate with PostgreSQL. All three services can run in Docker containers via docker-compose, or the backend and frontend can run locally against a containerized database.
