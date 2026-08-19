# TinyBudgetTracker API

A small personal budgeting tool built to keep an eye on a weekly spending budget. The API tracks how much of your weekly budget is left, logs individual transactions, and keeps a short history of how each week went.

## What it does

- Tracks a weekly budget: amount remaining, any rollover from previous weeks, and savings set aside
- Logs individual transactions with amount and date
- Appends a one-line summary to a history log at the end of each week (over/under budget)
- Serves a small vanilla HTML/CSS/JS frontend alongside the API

## Tech stack

- ASP.NET Core minimal API (.NET 10, C#)
- Vanilla HTML, CSS and JavaScript for the frontend (served from `wwwroot`)
- Local JSON/text files as storage — no database

## API endpoints

| Method | Route              | Description                          |
|--------|---------------------|---------------------------------------|
| GET    | `/api/data`          | Get current weekly budget state       |
| POST   | `/api/data`          | Update weekly budget state            |
| POST   | `/api/historik`      | Log a weekly summary to history       |
| GET    | `/api/transaktioner` | Get all logged transactions           |
| POST   | `/api/transaktion`   | Add a new transaction                 |

## Running it locally

```bash
dotnet run
```

The app will be available at `https://localhost:7114` (or `http://localhost:5201`).

## Status & known limitations

This is a personal, single-user project built to explore minimal APIs in .NET — there's no authentication, and CORS is currently open to any origin. It's not intended for public multi-user deployment as-is. Data is stored in flat JSON/text files rather than a database, which keeps things simple for a project of this size.
