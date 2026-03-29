# React Game

This project is split into:

- `frontend/`: the React game UI
- `BACKEND/`: the server-side API that talks to Groq

## Why the refactor?

The Groq call now lives on the backend instead of in the browser. This keeps the API key out of the client and makes the project safer to deploy publicly.

## Local setup

1. Create `BACKEND/.env` from `BACKEND/.env.example`
2. Optionally create `frontend/.env` from `frontend/.env.example`
3. Run `npm run install:backend`
4. Run `npm run install:frontend`
5. Start the backend with `npm run dev:backend`
6. Start the frontend with `npm run dev:frontend`

The frontend also has a CRA `proxy` to `http://localhost:4000`, so local development works even if `REACT_APP_API_BASE_URL` is not set.

## Environment variables

### Backend

`BACKEND/.env`

```env
GROQ_API_KEY=replace_with_new_groq_key
GROQ_MODEL_PRIMARY=llama-3.3-70b-versatile
GROQ_MODEL_DEGRADED=llama-3.1-8b-instant
FRONTEND_ORIGIN=http://localhost:3000
```

### Frontend

`frontend/.env`

```env
REACT_APP_API_BASE_URL=http://localhost:4000
```

## Docker

To start the full stack locally:

```bash
docker-compose up --build
```

The Docker frontend build injects `http://localhost:4000` as the API base URL, so the browser can still reach the backend service from your machine.

## Deployment recommendation

- Deploy `frontend/` as the public app
- Deploy `BACKEND/` as the private API layer
- Set the frontend to call the backend through `REACT_APP_API_BASE_URL`
- Never commit Groq secrets to the repo

### Suggested split

- Frontend Vercel project:
  `react-game.amets.engineer`
- Backend Vercel project:
  `react-game-api.amets.engineer`

The backend includes `api/index.js` so it can be deployed as its own Vercel project while still using `index.js` locally.

## Project documentation

https://github.com/ametsCS/ReactGame_AmetsCarrera/blob/main/ReactGame%20Documentation.pdf

![ReactGame Documentation](https://github.com/user-attachments/assets/9d6b39e6-709f-47f8-a8fd-8aee05af4058)
