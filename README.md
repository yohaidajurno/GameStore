# GameStore

> Full-stack games catalog. .NET 10 minimal API + React frontend.

![.NET 10](https://img.shields.io/badge/.NET-10-512BD4?logo=dotnet&logoColor=white)
![EF Core](https://img.shields.io/badge/EF_Core-10-512BD4)
![SQLite](https://img.shields.io/badge/SQLite-DB-003B57?logo=sqlite&logoColor=white)
![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)

---

## Flow

```mermaid
sequenceDiagram
    participant UI as React
    participant API as Minimal API
    participant DB as SQLite

    UI->>API: POST /games
    API->>DB: validate + insert
    API-->>UI: 201 GameDetails
    UI->>UI: refresh catalog
```

---

## API

| Method | Route          | Body            | Returns          |
| ------ | -------------- | --------------- | ---------------- |
| GET    | `/games`       | —               | `GameSummary[]`  |
| GET    | `/games/{id}`  | —               | `GameDetails`    |
| POST   | `/games`       | `CreateGameDto` | `201`            |
| PUT    | `/games/{id}`  | `UpdateGameDto` | `204`            |
| DELETE | `/games/{id}`  | —               | `204`            |
| GET    | `/genres`      | —               | `GenreDto[]`     |

---

## Backend Highlights

| Pattern              | Why                          |
| -------------------- | ---------------------------- |
| Minimal API groups   | Clear, terse routing         |
| DTO boundary         | Entities never leak          |
| `AsNoTracking`       | Lean read queries            |
| Migrations + seeding | Deterministic startup        |
| Scoped CORS          | Locked to dev origins        |
| Validation pipeline  | Fail fast at the edge        |

---

## Structure

```
GameStore.Api/        .NET 10 minimal API
  EndPoints/          route groups
  Models/             EF entities
  DTOs/               request/response
  Data/               DbContext, migrations, seed

GameStore.Frontend/   React + Vite
  src/api/            fetch client
  src/components/     catalog, table, form, details
```

---

## Run

```bash
dotnet run --project GameStore.Api

cd GameStore.Frontend && npm i && npm run dev
```

DB auto-migrates and seeds on first run.

---

## AI Disclosure

Backend by me. Frontend UI generated with AI assistance and integrated by me against the API contracts I designed.

---

**Yohai Dejorno** · [@yohaidajurno](https://github.com/yohaidajurno)
