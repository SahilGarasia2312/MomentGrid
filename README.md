# 📸 MomentGrid — Enterprise Event & Media Production Engine

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Jest](https://img.shields.io/badge/Jest-39_Suites_Passing-C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)
[![Clean Architecture](https://img.shields.io/badge/Architecture-Clean%20%2F%20DDD-0052CC?style=for-the-badge)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

> **MomentGrid** is a scalable, multi-tenant Event Photography & Media Production Engine built using **Clean Architecture** (Domain-Driven Design) on the backend and **Next.js 16 (App Router)** on the frontend. It seamlessly connects clients, freelance photographers, media studios, and event coordinators through intelligent match scoring, automated proofing workflows, production management, and secure financial operations.

---

## 📑 Table of Contents

1. [Architectural Overview](#-architectural-overview)
2. [Key Features & Capability Modules](#-key-features--capability-modules)
3. [Technology Stack](#-technology-stack)
4. [Project Structure](#-project-structure)
5. [Quick Start Guide](#-quick-start-guide)
6. [Environment Configuration](#-environment-configuration)
7. [Testing & Quality Assurance](#-testing--quality-assurance)
8. [Core Domain & Business Logic](#-core-domain--business-logic)
9. [API Endpoint Specifications](#-api-endpoint-specifications)
10. [Security & Production Hardening](#-security--production-hardening)
11. [License & Maintainers](#-license--maintainers)

---

## 🏗 Architectural Overview

MomentGrid follows strict **Clean Architecture / Domain-Driven Design (DDD)** principles to decouple core domain logic from framework dependencies, database persistence, and network transport layers.

```
                     ┌───────────────────────────────────────────┐
                     │            Presentation Layer             │
                     │    (Express Controllers & Middleware)     │
                     └────────────────────┬──────────────────────┘
                                          │
                                          ▼
                     ┌───────────────────────────────────────────┐
                     │             Application Layer             │
                     │    (Use Cases, DTOs & Domain Services)    │
                     └────────────────────┬──────────────────────┘
                                          │
                                          ▼
                     ┌───────────────────────────────────────────┐
                     │               Domain Layer                │
                     │      (Entities, Value Objects, Rules)     │
                     └────────────────────▲──────────────────────┘
                                          │
                     ┌────────────────────┴──────────────────────┐
                     │           Infrastructure Layer            │
                     │   (Mongoose Schemas, Repositories, JWT)   │
                     └───────────────────────────────────────────┘
```

* **Domain Layer**: Contains core business entities (`User`, `Event`, `Album`, `Gallery`, `Photographer`, `Studio`, `Payment`, `Notification`, `EventTask`, `EventTeamAssignment`) and standalone business rules (such as `MomentMatchScoringEngine`).
* **Application Layer**: Contains isolated Use Cases (`CreateEventUseCase`, `LoginUseCase`, `SubmitAlbumSelectionUseCase`, `SearchStudiosUseCase`) guaranteeing single-responsibility operations.
* **Infrastructure Layer**: Handles persistence (MongoDB models via Mongoose), authentication providers, email dispatchers (Nodemailer), and repository implementations.
* **Presentation Layer**: Express controllers, custom middleware (`requireAdminRole`, rate limiting), and standardized error handling middleware pipelines.

---

## ✨ Key Features & Capability Modules

### 🎯 1. MomentMatch™ Intelligent Recommendation Engine
* Proprietary scoring system evaluating photographer portfolio alignment, budget tier compatibility, geographic proximity, and historical client feedback.
* Dynamic sorting algorithm prioritizing highly responsive and verified photographers/studios.

### 👥 2. Multi-Role User Workflows
* **Clients**: Search marketplace, place event bookings, review proofs, approve photo selections, process milestone payments, and track production status.
* **Photographers & Studios**: Profile management, service package tier configuration, calendar availability tracking, team member assignment, and task execution.
* **Admins**: Platform overview, operational metrics, analytics reporting, system-wide content moderation, and user status controls.

### 🖼 3. Interactive Proofing & Album Selection
* Client proofing workflow with real-time selection limits, status tracking (Pending, Submitted, Approved, Locked), and custom client notes per photograph.
* Virtual gallery management supporting nested folder structures, batch image uploads, tags, and client access tokens.

### 📋 4. Production & Team Collaboration Engine
* Granular event production tracking with task delegation, milestone completion monitoring, and time logs.
* Studio team collaboration tools for assigning primary photographers, second shooters, videographers, and post-processing editors.

---

## 🛠 Technology Stack

### Backend Services
* **Runtime**: Node.js v18+ (ES modules / CommonJS architecture)
* **Framework**: Express.js 4.19+
* **Database**: MongoDB with Mongoose ORM (8.5+)
* **Security & Auth**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `cookie-parser`, `helmet`, `express-rate-limit`
* **Testing**: Jest (39 Test Suites, 171 Tests), Supertest
* **Utilities**: `nodemailer`, `express-validator`

### Frontend Application
* **Framework**: Next.js 16.2 (App Router, React 19)
* **Language**: TypeScript 5.0
* **Styling**: Tailwind CSS 3.4, PostCSS, Autoprefixer
* **UI Components**: Radix UI Primitives, Lucide Icons, Class Variance Authority (`cva`), `tailwind-merge`
* **Animations**: Framer Motion 13

### DevOps & Tooling
* **Containerization**: Docker Compose (`mongo:latest`)
* **Dev Automation**: Custom `start-dev.sh` (Dynamic Port Auto-Allocation & Graceful Signal Trapping)

---

## 📂 Project Structure

```bash
MomentGrid/
├── backend/                        # Node.js / Express Clean Architecture Service
│   ├── src/
│   │   ├── domain/                 # Core Entities, Domain Services & Repository Contracts
│   │   │   ├── entities/           # Event, User, Album, Gallery, Photographer, Studio, etc.
│   │   │   │   ├── collaboration/  # Team assignment & role management domain models
│   │   │   │   └── production/     # Event tasks & production milestone models
│   │   │   └── services/           # MomentMatch scoring algorithm
│   │   ├── application/            # Application Use Cases & DTOs
│   │   │   ├── dtos/               # Request/Response Data Transfer Objects
│   │   │   ├── errors/             # Domain & Application Exception definitions
│   │   │   └── usecases/           # Isolated business logic executions per domain feature
│   │   ├── infrastructure/         # External service drivers, DB models & repositories
│   │   └── presentation/           # HTTP Routing, Express Controllers & Security Middleware
│   ├── server.js                   # Application bootstrap & MongoDB initial connection
│   └── package.json
├── frontend/                       # Next.js 16 App Router Client Interface
│   ├── src/
│   │   ├── app/                    # Next.js App Router Page hierarchy
│   │   │   ├── (auth)/             # Authentication views (Login, Register, Password Reset)
│   │   │   ├── admin/              # Platform Administration Dashboard
│   │   │   ├── client/             # Client Event & Booking Portal
│   │   │   ├── photographer/       # Photographer Profile & Portfolio Manager
│   │   │   ├── gallery-manager/    # Media Proofing & Photo Selection Portal
│   │   │   ├── payments/           # Financial Transactions & Invoicing View
│   │   │   └── page.js             # Marketplace & Platform Landing Page
│   │   ├── components/             # Reusable UI component library (Radix + Tailwind)
│   │   ├── lib/                    # API Clients, Constants & Utilities
│   │   └── styles/                 # Global styles & Tailwind entrypoints
│   └── package.json
├── docker-compose.yml              # Local MongoDB Service Configuration
├── start-dev.sh                    # Automated Local Dev Launcher Script
└── README.md                       # Master Documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
Make sure you have the following installed on your host system:
* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher
* **Docker Desktop / Docker Engine**: (For local MongoDB database)

---

### Option A: Automated One-Command Startup (Recommended)

MomentGrid features a port collision-free launch script that checks for active ports, dynamically assigns free ports to services, starts MongoDB via Docker, and handles graceful process termination.

```bash
# Make script executable (first time only)
chmod +x start-dev.sh

# Run the launcher
./start-dev.sh
```

The script will automatically perform:
1. Startup of local MongoDB docker container on port `27017`.
2. Dynamic discovery of available ports starting from `4000` (Backend) and `3000` (Frontend).
3. Injection of dynamic cross-origin environment variables (`CLIENT_URL` & `NEXT_PUBLIC_API_URL`).
4. Parallel execution of both development servers with combined log streaming.

---

### Option B: Manual Service Launch

#### 1. Start MongoDB
```bash
docker compose up -d
```

#### 2. Start Backend API
```bash
cd backend
cp .env.example .env   # Configure environment variables if needed
npm install
npm run dev
```
> Backend runs at `http://localhost:4000`

#### 3. Start Frontend Client
```bash
cd frontend
cp .env.local .env.local   # Ensure NEXT_PUBLIC_API_URL points to backend
npm install
npm run dev
```
> Frontend runs at `http://localhost:3000`

---

## ⚙️ Environment Configuration

### Backend Environment Variables (`backend/.env`)

```ini
PORT=4000
MONGODB_URI=mongodb://localhost:27017/momentgrid
JWT_SECRET=your_super_secret_jwt_key_momentgrid_2026
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000

# Email Notifications (Optional for Local Dev)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Frontend Environment Variables (`frontend/.env.local`)

```ini
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## 🧪 Testing & Quality Assurance

MomentGrid uses **Jest** for unit testing domain models, use cases, and presentation middleware. All business logic is strictly tested in isolation from external services.

### Running Backend Test Suite
```bash
cd backend
npm test
```

### Watching Tests During Development
```bash
cd backend
npm run test:watch
```

### Test Suite Execution Report
```text
PASS src/application/usecases/photographer/__tests__/UpdatePhotographerProfileUseCase.test.js
PASS src/application/usecases/gallery/__tests__/ManageGalleryFoldersUseCase.test.js
PASS src/application/usecases/collaboration/__tests__/CollaborationUseCases.test.js
PASS src/domain/services/__tests__/MomentMatchScoringEngine.test.js
...
Test Suites: 39 passed, 39 total
Tests:       171 passed, 171 total
Snapshots:   0 total
Time:        1.779 s
```

---

## 📌 Core Domain & Business Logic

### MomentMatch™ Scoring Engine Algorithm

The `MomentMatchScoringEngine` domain service calculates a match score (0.0 to 100.0) between client preferences and photographer profiles based on weighted factors:

$$\text{Score} = (W_{\text{style}} \times S_{\text{style}}) + (W_{\text{budget}} \times S_{\text{budget}}) + (W_{\text{rating}} \times S_{\text{rating}}) + (W_{\text{distance}} \times S_{\text{distance}})$$

```javascript
// Example score calculation
const matchScore = MomentMatchScoringEngine.calculateScore({
  photographer: { styles: ['wedding', 'candid'], hourlyRate: 150, rating: 4.9 },
  requirements: { style: 'wedding', maxBudget: 200, location: 'New York' }
});
```

---

## 📡 API Endpoint Specifications

Here is a summary of primary REST API routes provided by the backend application:

| Category | Endpoint | Method | Access Level | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `/api/v1/auth/register` | `POST` | Public | Register new user (Client/Photographer/Studio) |
| **Auth** | `/api/v1/auth/login` | `POST` | Public | User authentication & JWT issuance |
| **Auth** | `/api/v1/auth/refresh` | `POST` | Public | Refresh JWT session cookie |
| **Marketplace** | `/api/v1/marketplace/photographers` | `GET` | Public | Query photographers with filters & MomentMatch scores |
| **Marketplace** | `/api/v1/marketplace/studios` | `GET` | Public | Search studio profiles and service packages |
| **Event** | `/api/v1/events` | `POST` | Authenticated | Create new photography event request |
| **Booking** | `/api/v1/bookings` | `POST` | Authenticated | Initiate booking request with photographer/studio |
| **Gallery** | `/api/v1/galleries/:id/upload` | `POST` | Photographer | Batch upload high-res images to gallery |
| **Album** | `/api/v1/albums/:id/select` | `POST` | Client | Submit client photo selections for print album |
| **Production** | `/api/v1/production/tasks` | `GET/POST` | Team/Studio | Manage post-processing & editing tasks |
| **Admin** | `/api/v1/admin/overview` | `GET` | Admin | Access platform analytics and revenue insights |

---

## 🛡 Security & Production Hardening

* **Password Security**: Passwords stored using `bcryptjs` with salt rounds configured to standard security thresholds.
* **HTTP Security Headers**: Integrated `helmet` middleware to set `X-Frame-Options`, `X-Content-Type-Options`, and `Strict-Transport-Security`.
* **Rate Limiting**: `express-rate-limit` prevents brute-force authentication attacks on sensitive routes (`/login`, `/register`).
* **Input Validation & Sanitization**: Strict request input checking via `express-validator` and domain-level entity validation.
* **Session Token Handling**: Secure, `HttpOnly`, `SameSite` cookies for token delivery, protecting against Cross-Site Scripting (XSS).

---

## 📜 License & Maintainers

Distributed under the **MIT License**. See `LICENSE` for more information.

**Project Lead & Architect**: Sahil Garasia  
**Repository**: [MomentGrid Workspace](file:///home/sahil-garasia/Interview%20Prep/Projects/MomentGrid)

---

<p align="center">Made with ❤️ for high-performance event photography management.</p>
