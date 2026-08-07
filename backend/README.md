# Sentinel AI — Backend Foundation (Phase 2)

Financial Operating System & Governance Proxy Layer for Autonomous AI Agents.

---

## 🚀 Overview

Sentinel AI sits transparently between Autonomous AI Agents and Paid External APIs. Every spend request initiated by an AI agent passes through a 7-stage governance pipeline:

```text
User / Agent Request
        ↓
Policy Engine (AST Rules, Caps, Denied Models)
        ↓
Budget Engine (Daily/Monthly Runway Caps & Alerts)
        ↓
Risk Engine (0-100 Multi-Factor AI Risk Scorer)
        ↓
Approval Engine (Threshold Rules: <$20 Auto, $20-$100 Manager, >$100 Finance, >$1000 Exec)
        ↓
Algorand Blockchain (Cryptographic SHA-256 State Proof Audit Commit)
        ↓
x402 Authorization (RFC / HTTP 402 Micropayment Protocol Handshake)
        ↓
External Paid API Execution (Key Pool Round-Robin Rotation with 429 Failover)
```

---

## 🛠️ Tech Stack & Architecture

- **Language & Core Framework**: Python 3.13 / 3.11+, FastAPI, Pydantic v2.
- **ORM & Database**: SQLAlchemy 2.0 (Async Session), Alembic, Asyncpg (PostgreSQL) / Aiosqlite (SQLite dev/test fallback).
- **Security & Authorization**: JWT Access/Refresh tokens, Bcrypt password hashing, RBAC (Admin, Manager, Employee), and `X402ProtocolMiddleware`.
- **Blockchain Ledger**: Algorand Testnet/Mainnet SDK (`algosdk`), Zero-Knowledge state proofs, SHA-256 immutability hashes.
- **AI Key Resilience**: 5-Key round-robin key pool manager across **Gemini**, **Grok**, **OpenRouter**, and **Local Ollama** with automatic 429 failover and 60-second cooldown recovery.
- **Real-Time Stream**: WebSockets Manager (`/ws`) for live governance event broadcasts.

---

## 💻 Setup & Run Locally

### 1. Install Dependencies
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Run FastAPI Development Server
```bash
uvicorn app.main:app --reload --port 8000
```
- Interactive Swagger UI: `http://localhost:8000/docs`
- ReDoc Documentation: `http://localhost:8000/redoc`

### 4. Run Pytest Test Suite
```bash
pytest -v
```

---

## 📡 REST API Summary

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/v1/auth/login` | `POST` | Authenticates user & returns JWT Access/Refresh tokens |
| `/api/v1/auth/register` | `POST` | Registers new user account |
| `/api/v1/agents` | `GET` / `POST` | List and register autonomous agents |
| `/api/v1/policies` | `GET` / `POST` | Manage dynamic AST spend policies |
| `/api/v1/budgets` | `GET` / `PATCH` | View and adjust daily/monthly runway budget caps |
| `/api/v1/spend-request` | `POST` / `GET` | Intercept and process agent spend through 7-stage pipeline |
| `/api/v1/approval` | `POST` / `GET` | Human governance approval queue & decision dispatch |
| `/api/v1/risk-analysis` | `POST` | Run 0-100 multi-factor AI risk evaluation |
| `/api/v1/blockchain` | `GET` | Retrieve Algorand Mainnet cryptographic audit transaction proofs |
| `/api/v1/providers` | `GET` | Query AI Key Pool status & health metrics |
| `/api/v1/analytics` | `GET` | Fetch executive KPIs, run-rate projections, & top spender metrics |
