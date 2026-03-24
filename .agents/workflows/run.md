---
description: How to run the Stock Portfolio application (backend + frontend)
---

## Prerequisites

1. **MySQL** must be running on `localhost:3306`
2. A database called `stock_portfolio_db` must exist
3. MySQL credentials: `root` / `root123` (configured in `backend/src/main/resources/application.properties`)

## Steps

### 1. Start the Backend (Spring Boot)

Open a terminal and run:

```bash
cd /Users/nihal/Downloads/stockportfolio/backend
./mvnw spring-boot:run
```

Wait until you see: `Started BackendApplication in X seconds`

The backend API will be available at **http://localhost:8080**

### 2. Start the Frontend (Vite + React)

Open a **separate** terminal and run:

```bash
cd /Users/nihal/Downloads/stockportfolio/frontend
npm run dev
```

The frontend will be available at **http://localhost:3000**

### 3. Open the App

Open **http://localhost:3000** in your browser.

## Stopping

- Press `Ctrl + C` in each terminal to stop the respective server.
