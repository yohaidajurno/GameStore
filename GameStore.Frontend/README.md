# GameStore Frontend

React admin frontend for the GameStore API.

## Run locally

Start the API from the repository root:

```bash
dotnet run --project GameStore.Api/GameStore.Api.csproj --launch-profile http
```

Start the frontend:

```bash
cd GameStore.Frontend
npm run dev
```

The frontend expects the API at `http://localhost:5144`. To point it somewhere
else, create `.env` from `.env.example` and change `VITE_API_BASE_URL`.

## Verify

```bash
npm run lint
npm run build
dotnet build ../GameStore.Api/GameStore.Api.csproj
```
