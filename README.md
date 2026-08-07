# 🛡️ Sentinel AI — Financial Operating System for Autonomous AI Agents

> **The Enterprise Spend Policy Engine that Authorizes, Limits, Monitors, and Audits Outbound AI Agent API Transactions.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js 15](https://img.shields.io/badge/Frontend-Next.js%2015%20(App%20Router)-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20(Python%203.13)-009688)](https://fastapi.tiangolo.com/)
[![Algorand](https://img.shields.io/badge/Blockchain-Algorand%20Mainnet%2FTestnet-000000)](https://algorand.co/)
[![x402 Protocol](https://img.shields.io/badge/Protocol-x402%20Micropayments-8b5cf6)](https://x402.org)

---

## 🚀 Problem Statement

Autonomous AI agents are increasingly authorized to make independent financial expenditures (API calls, cloud resource provisioning, data scraping, flight bookings). Existing payment rails and corporate credit cards were built for humans and lack **real-time sub-second spend authorization, AST policy enforcement, risk scoring, and tamper-proof blockchain auditability**.

---

## ⚡ The Sentinel AI Solution

Sentinel AI acts as a **Financial Control Plane** between AI Agents and external API providers. Every outbound financial request passes through a 9-stage pipeline:

```text
User Request ➔ AI Agent ➔ Spend Request ➔ Policy AST Engine ➔ Budget Engine ➔ Risk Engine (0-100) ➔ Approval Tier ➔ Algorand State Proof ➔ x402 Micropayment Token ➔ AI Provider Key Pool ➔ Response
```

---

## ✨ Core Innovations

- **x402 Micropayment Authorization**: Native implementation of the HTTP 402 Payment Required protocol issuing signed headers for agent transactions.
- **Algorand Cryptographic Ledger**: SHA-256 state proof hashing committed to Algorand for immutable, non-repudiable audit trails.
- **Dynamic AST Policy Builder**: No-code boolean rule engine (`AND`, `OR`, `NOT`, single spend caps, prohibited models).
- **0-100 AI Risk Scoring Engine**: Evaluates amount severity, vendor trust, velocity bursts, and off-hours execution.
- **5-Key Failover Pool**: Round-robin key rotation across Gemini, Grok, OpenRouter, and Ollama with automatic 429 rate-limit failover.
- **Frontier Cost Optimizer**: Automatically intercepts high-cost model requests (e.g., GPT-5) and recommends cost-effective alternatives (e.g., Gemini 2.0 Flash saving 90%).

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, Recharts, Lucide Icons |
| **Backend** | FastAPI (Python 3.13), SQLAlchemy 2.0 Async, Pydantic v2, Pytest |
| **Database & Cache** | PostgreSQL 16, Redis 7 |
| **Blockchain** | Algorand PySDK (`py-algorand-sdk`), ZK State Proofs |
| **Protocol** | x402 HTTP Payment Authorization Protocol |
| **Containerization** | Docker, Docker Compose |

---

## ⚡ Quickstart

### Prerequisites
- Python 3.13+
- Node.js 20+
- Docker (Optional)

### 1. Run Backend
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate | Linux/macOS: source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 2. Run Frontend
```bash
# In project root
npm install
npm run dev
```

Open `http://localhost:3000` to launch Sentinel AI.

---

## 📜 Documentation & Hackathon Package

- [Architecture & ER Diagrams](docs/ARCHITECTURE.md)
- [Hackathon Submission & Pitch Deck Scripts](docs/SUBMISSION.md)
- [FastAPI Backend Guide](backend/README.md)

---

## 📄 License
MIT License. Developed for the Hackathon 2026.
