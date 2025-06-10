# Schweizer Abenteuerland

Ein interaktives Lernspiel für Erstklässler (6-7 Jahre) mit Schweizer Themen und Kultur.

## 🎯 Projektübersicht

**Name**: Schweizer Abenteuerland  
**Zielgruppe**: Erstklässler (6-7 Jahre)  
**Plattform**: Web-basiert (Desktop & Tablet optimiert)  
**Entwicklungsdauer**: 8-10 Wochen  

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 13.5.x (App Router) - Node.js 18.14 kompatibel
- **Sprache**: TypeScript
- **Styling**: Tailwind CSS + CSS Modules
- **UI-Komponenten**: Radix UI + Custom Components
- **Animationen**: Framer Motion, React Spring, Lottie
- **State Management**: Zustand
- **Audio**: Howler.js
- **Icons**: Lucide React

### Backend & Database
- **Runtime**: Node.js 18.14.2 (LTS)
- **Framework**: Express.js 4.18.x
- **API**: RESTful API mit JSON
- **Authentifizierung**: JSON Web Tokens (JWT)
- **Haupt-DB**: PostgreSQL 15.x
- **Cache**: Redis 7.x
- **ORM**: Prisma 5.x
- **File Storage**: Local (Dev) / AWS S3 oder Cloudinary (Prod)

### Development Tools
- **Build Tool**: Next.js built-in (Webpack 5)
- **Linting**: ESLint + Prettier
- **Testing**: Jest, React Testing Library, Playwright
- **Package Manager**: npm (Node.js 18.14 kompatibel)
- **Container**: Docker & Docker Compose

## 🎮 Minispiele

### Verfügbar
1. **Buchstaben-Berg** - Lesen & Schreiben mit Drag & Drop
2. **Zahlen-Express** - Mathematik (1-20, Addition/Subtraktion)
3. **Tier-Safari** - Memory mit Schweizer Tieren

### In Entwicklung
4. **Alphorn-Melodie** - Musik & Rhythmus
5. **Kantone-Puzzle** - Schweizer Geografie
6. **Jahreszeiten-Rad** - Zeit & Natur

## 🚀 Quick Start

### Voraussetzungen
- Node.js 18.14.2
- Docker & Docker Compose
- PostgreSQL 15.x (via Docker)
- Redis 7.x (via Docker)

### Installation

```bash
# Repository klonen
git clone https://github.com/your-repo/schweizer-lernspiel.git
cd schweizer-lernspiel

# Docker-Container starten
docker-compose up -d

# Frontend Setup
cd frontend
npm install
npm run dev

# Backend Setup (in neuem Terminal)
cd backend
npm install
npx prisma migrate dev
npm run dev
```

### Umgebungsvariablen

Frontend (.env.local):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Backend (.env):
```env
NODE_ENV=development
PORT=3001
DATABASE_URL="postgresql://lernspiel_user:lernspiel_pass@localhost:5432/lernspiel_db"
REDIS_URL="redis://localhost:6379"
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
```

## 📁 Projektstruktur

```
schweizer-lernspiel/
├── frontend/
│   ├── app/                    # Next.js App Router
│   │   ├── spiele/            # Spiele-Routen
│   │   └── profil/            # Benutzer-Dashboard
│   ├── components/
│   │   ├── ui/                # Basis UI-Komponenten
│   │   ├── game/              # Spiel-spezifische Komponenten
│   │   └── animations/        # Animationskomponenten
│   ├── lib/
│   │   ├── game-engine/       # Spiel-Engine
│   │   ├── audio/             # Audio-Management
│   │   └── utils/             # Utilities
│   ├── hooks/                 # Custom React Hooks
│   └── store/                 # Zustand Stores
├── backend/
│   ├── src/
│   │   ├── api/              # API Endpoints
│   │   ├── middleware/        # Express Middleware
│   │   ├── services/          # Business Logic
│   │   └── models/            # Database Models
│   └── prisma/
│       └── schema.prisma      # Database Schema
├── shared/                    # Gemeinsame Types
└── docker-compose.yml         # Docker Setup
```

## ✨ Implementierte Features

### Phase 1 - Grundstruktur ✅
- [x] Projekt-Setup mit Next.js 13.5.x
- [x] Design-System mit Schweizer Farben
- [x] Basis UI-Komponenten (Button, Card, Modal)
- [x] Routing-Struktur
- [x] Audio-System mit Howler.js
- [x] Docker Setup für Datenbanken

### Phase 2 - Core Features ✅
- [x] Game Engine mit Punktesystem
- [x] Level-Progression
- [x] Achievement-System
- [x] State Management mit Zustand
- [x] Fehler-Toleranz für Kinder
- [x] Auto-Save Funktionalität

### In Entwicklung 🚧
- [ ] Erste spielbare Minispiele
- [ ] Backend API Implementation
- [ ] Authentifizierung
- [ ] Eltern-Dashboard
- [ ] PWA Features

## 🎨 Design-System

### Farben
- **Primary**: Alpine Blue (#0066cc)
- **Secondary**: Sunshine Yellow (#ffd700)
- **Success**: Forest Green (#228b22)
- **Danger**: Swiss Red (#ff0000)

### Features
- Glassmorphismus-Effekte
- Smooth Animationen
- Mikrointeraktionen
- Kinderfreundliche UI

## 🏗️ Architektur

### Frontend
- **Next.js App Router** für optimales Routing
- **Zustand** für globales State Management
- **Framer Motion** für flüssige Animationen
- **TypeScript** für Type-Safety

### Backend
- **Express.js** REST API
- **Prisma ORM** für Datenbank-Zugriff
- **JWT** für sichere Authentifizierung
- **Redis** für Caching und Sessions

### Datenbank-Schema
- Users & Profiles
- Game Progress Tracking
- Achievements System
- Learning Statistics

## 🧪 Testing

```bash
# Unit Tests
npm run test

# E2E Tests
npm run test:e2e

# Test Coverage
npm run test:coverage
```

## 🚢 Deployment

### Frontend (Vercel)
```bash
vercel --prod
```

### Backend (Railway/Heroku)
- PostgreSQL & Redis Add-ons
- Environment Variables konfigurieren
- Auto-Deploy via GitHub

## 📈 Performance

- Code-Splitting für schnelle Ladezeiten
- Lazy Loading für Bilder und Audio
- Service Worker für Offline-Funktionalität
- Optimierte Bundle-Größe

## 🔒 Sicherheit

- JWT Authentication
- Bcrypt Password Hashing
- Helmet.js für Security Headers
- Input Validation mit Joi
- CORS richtig konfiguriert

## 👥 Mitwirkende

Contributions sind willkommen! Bitte erstelle einen Pull Request.

## 📝 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe [LICENSE](LICENSE) Datei für Details.

---

**Entwickelt mit ❤️ für Schweizer Kinder**