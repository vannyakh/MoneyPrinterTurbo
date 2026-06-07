# MoneyPrinterTurbo Frontend

This directory contains the new Web UI based on:

- React (TypeScript)
- Vite (latest template)
- Tailwind CSS v4
- Chakra UI v3
- Zustand (app state)
- TanStack Query (server state)
- React Router (route config in `src/router/routes.tsx`)

## Folder Structure

```text
src/
  components/ui/      # reusable UI components
  constants/          # constants and config values
  hooks/              # custom hooks and query mutations
  lib/                # api helpers
  pages/              # page-level components
  router/             # route creation and route table
  store/              # zustand stores
  theme/              # chakra custom style system config
```

## Development

1. Install dependencies:

```bash
npm install
```

2. Configure backend API URL:

```bash
cp .env.example .env
```

3. Start dev server:

```bash
npm run dev
```

By default, the app targets `http://127.0.0.1:8080` for backend APIs.

## Build

```bash
npm run build
```
