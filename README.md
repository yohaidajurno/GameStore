# GameStore

> Full-stack games catalog built with **.NET 10 Minimal API**, **Entity Framework Core**, **SQLite**, and a **React + Vite frontend**.

GameStore is a portfolio project focused primarily on backend API development.  
The backend demonstrates REST-style endpoint design, DTO-based contracts, EF Core persistence, migrations, database seeding, validation, and separation between API, data, and frontend concerns.

---

## Tech Stack

![.NET 10](https://img.shields.io/badge/.NET-10-512BD4?logo=dotnet&logoColor=white)
![ASP.NET Core](https://img.shields.io/badge/ASP.NET_Core-Minimal_API-512BD4?logo=dotnet&logoColor=white)
![EF Core](https://img.shields.io/badge/EF_Core-10-512BD4)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?logo=sqlite&logoColor=white)
![REST API](https://img.shields.io/badge/API-REST-02569B)
![CORS](https://img.shields.io/badge/CORS-Scoped-2E7D32)
![Validation](https://img.shields.io/badge/Validation-Enabled-1565C0)
![Migrations](https://img.shields.io/badge/EF_Migrations-Enabled-6A1B9A)
![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Frontend-3178C6?logo=typescript&logoColor=white)

---

## Backend Focus

The main focus of this project is the **.NET backend**.

The frontend exists to consume and demonstrate the API, but the core engineering work is in:

- Minimal API endpoint design
- DTO request/response contracts
- Entity Framework Core data access
- SQLite persistence
- Database migrations
- Startup seeding
- Validation at the API boundary
- Scoped CORS configuration
- Separation between EF Core entities and external API models

---

## Architecture

~~~mermaid
flowchart LR
    Client[React Frontend] -->|HTTP Requests| API[.NET 10 Minimal API]

    API --> Routes[Endpoint Groups]
    Routes --> Validation[Request Validation]
    Validation --> DTOs[DTO Contracts]
    DTOs --> EF[EF Core DbContext]
    EF --> DB[(SQLite Database)]

    EF --> Migrations[EF Core Migrations]
    EF --> Seed[Seed Data]

    API --> CORS[Scoped CORS Policy]
~~~

---

## Request Flow

~~~mermaid
sequenceDiagram
    participant UI as React Frontend
    participant API as Minimal API Endpoint
    participant VAL as Validation
    participant DB as SQLite Database

    UI->>API: POST /games
    API->>VAL: Validate CreateGameDto
    VAL-->>API: Valid request
    API->>DB: Insert game through EF Core
    DB-->>API: Saved entity
    API-->>UI: 201 Created + GameDetailsDto
    UI->>UI: Refresh catalog
~~~

---

## Data Flow

~~~mermaid
flowchart TD
    Request[HTTP Request] --> Endpoint[Minimal API Endpoint]
    Endpoint --> DTO[Request DTO]
    DTO --> Validation[Validation]
    Validation --> Entity[EF Core Entity]
    Entity --> DbContext[GameStoreDbContext]
    DbContext --> SQLite[(SQLite)]
    SQLite --> ResponseDTO[Response DTO]
    ResponseDTO --> Response[HTTP Response]
~~~

---

## Database Model

~~~mermaid
erDiagram
    GENRE ||--o{ GAME : contains

    GENRE {
        int Id
        string Name
    }

    GAME {
        int Id
        string Name
        int GenreId
        decimal Price
        date ReleaseDate
    }
~~~

---

## API Endpoints

| Method | Route         | Body            | Returns         | Purpose |
| ------ | ------------- | --------------- | --------------- | ------- |
| GET    | `/games`      | —               | `GameSummary[]` | List all games |
| GET    | `/games/{id}` | —               | `GameDetails`   | Get one game by ID |
| POST   | `/games`      | `CreateGameDto` | `201 Created`   | Create a new game |
| PUT    | `/games/{id}` | `UpdateGameDto` | `204 NoContent` | Update an existing game |
| DELETE | `/games/{id}` | —               | `204 NoContent` | Delete a game |
| GET    | `/genres`     | —               | `GenreDto[]`    | List available genres |

---

## Backend Highlights

| Feature | Purpose |
| ------- | ------- |
| Minimal API groups | Keeps endpoint definitions organized and concise |
| DTO boundary | Prevents EF Core entities from leaking outside the backend |
| EF Core DbContext | Centralizes database access and entity configuration |
| SQLite database | Provides lightweight local persistence for development |
| EF Core migrations | Tracks and applies database schema changes |
| Database seeding | Creates predictable startup data |
| `AsNoTracking` | Optimizes read-only queries |
| Scoped CORS | Restricts frontend access to configured development origins |
| Validation pipeline | Rejects invalid requests before they reach persistence logic |
| REST-style routes | Provides predictable HTTP-based resource access |

---

## Solution Structure

~~~text
GameStore.Api/                  .NET 10 Minimal API backend
  EndPoints/                    Route groups for games and genres
  Models/                       EF Core entities
  DTOs/                         Request and response contracts
  Data/                         DbContext, migrations, and seed data

GameStore.Frontend/             React + Vite frontend
  src/api/                      API client functions
  src/components/               Catalog, table, form, and details UI
~~~

---

## Run Locally

### 1. Start the backend

~~~bash
dotnet run --project GameStore.Api
~~~

The SQLite database is created automatically.  
Migrations and seed data run during startup.

### 2. Start the frontend

~~~bash
cd GameStore.Frontend
npm install
npm run dev
~~~

---

## What This Project Demonstrates

This project demonstrates practical backend development skills for a .NET role:

- Building a .NET Minimal API
- Designing REST-style endpoints
- Creating request and response DTOs
- Separating API contracts from EF Core entities
- Using Entity Framework Core with SQLite
- Applying database migrations
- Seeding initial data
- Validating incoming API requests
- Configuring scoped CORS for frontend integration
- Connecting a React frontend to a .NET backend
- Structuring a small full-stack project clearly

---

## AI Disclosure

The backend was designed and implemented by me.

The frontend UI was created with AI assistance, then reviewed, integrated, and connected by me against the API contracts I designed.

---

## Author

**Yohai Dejorno**  
GitHub: [@yohaidajurno](https://github.com/yohaidajurno)
