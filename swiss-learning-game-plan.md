# Schweizer Lernspiel - Implementierungsplan

## Projektübersicht
**Name**: Schweizer Abenteuerland  
**Zielgruppe**: Erstklässler (6-7 Jahre)  
**Plattform**: Web-basiert (Desktop & Tablet optimiert)  
**Entwicklungsdauer**: 8-10 Wochen  

## Technology Stack

### Frontend
```yaml
Framework: Next.js 13.5.x (App Router) # Compatible with Node.js 18.14
Sprache: TypeScript
Styling: 
  - Tailwind CSS
  - CSS Modules für spezielle Animationen
UI-Komponenten: 
  - Radix UI (für Accessibility)
  - Custom Components
Animationen:
  - Framer Motion
  - React Spring
  - Lottie für komplexe Animationen
State Management: Zustand
Audio: Howler.js
Icons: Lucide React
```

### Backend & Database
```yaml
Runtime: Node.js 18.14.2 (LTS)
Framework: Express.js 4.18.x
API: RESTful API mit JSON
Authentifizierung: JSON Web Tokens (JWT)
Validation: Joi oder express-validator

Database:
  Haupt-DB: PostgreSQL 15.x
    - Benutzerprofile
    - Spielfortschritt
    - Achievements
    - Lernstatistiken
  Cache: Redis 7.x
    - Session Management
    - Spielstände Zwischenspeicherung
    - Leaderboards
  File Storage: 
    - Local filesystem für Development
    - AWS S3 oder Cloudinary für Production (Bilder, Audio)

ORM/Query Builder: 
  - Prisma 5.x (mit Node.js 18 kompatibel)
  - Alternative: Knex.js mit Objection.js

Database Schema:
  - users (id, username, email, created_at)
  - profiles (user_id, avatar, age_group, preferences)
  - game_progress (user_id, game_id, level, score, completed_at)
  - achievements (id, name, description, icon)
  - user_achievements (user_id, achievement_id, earned_at)
  - learning_stats (user_id, subject, correct_answers, total_attempts)
```

### Development Tools
```yaml
Build Tool: Next.js built-in (Webpack 5)
Linting: ESLint + Prettier
Testing: 
  - Jest für Unit Tests
  - React Testing Library
  - Playwright für E2E Tests
Version Control: Git
Package Manager: npm (Node.js 18.14 kompatibel)
```

## Projektstruktur

```
schweizer-lernspiel/
├── frontend/
│   ├── src/
│   │   ├── app/                    # Next.js App Router
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── api/               # API Routes (für BFF Pattern)
│   │   │   ├── spiele/
│   │   │   │   ├── buchstaben/
│   │   │   │   ├── zahlen/
│   │   │   │   ├── natur/
│   │   │   │   └── musik/
│   │   │   └── profil/
│   │   ├── components/
│   │   │   ├── ui/                 # Basis UI-Komponenten
│   │   │   ├── game/               # Spiel-spezifische Komponenten
│   │   │   ├── animations/         # Animationskomponenten
│   │   │   └── layout/             # Layout-Komponenten
│   │   ├── lib/
│   │   │   ├── game-engine/        # Spiel-Logik
│   │   │   ├── audio/              # Audio-Management
│   │   │   ├── animations/         # Animation Utilities
│   │   │   └── utils/              # Allgemeine Utilities
│   │   ├── hooks/                  # Custom React Hooks
│   │   ├── store/                  # Zustand Store
│   │   ├── types/                  # TypeScript Types
│   │   └── styles/                 # Globale Styles
│   ├── public/
│   │   ├── audio/                  # Soundeffekte & Musik
│   │   ├── images/                 # Statische Bilder
│   │   └── animations/             # Lottie JSON Files
│   └── tests/                      # Frontend Tests
├── backend/
│   ├── src/
│   │   ├── api/                    # API Endpoints
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── games/
│   │   │   └── progress/
│   │   ├── middleware/             # Express Middleware
│   │   ├── services/               # Business Logic
│   │   ├── models/                 # Database Models
│   │   ├── utils/                  # Utility Functions
│   │   └── config/                 # Configuration
│   ├── prisma/
│   │   ├── schema.prisma           # Database Schema
│   │   └── migrations/             # Database Migrations
│   └── tests/                      # Backend Tests
├── shared/                         # Shared Types/Interfaces
└── docker-compose.yml              # Local Development Setup
```

## Implementierungsphasen

### Phase 1: Projekt-Setup & Grundstruktur (Woche 1) ✅ ABGESCHLOSSEN

#### Tasks:
1. **Projekt initialisieren** ✅
   ```bash
   npx create-next-app@13.5.6 schweizer-lernspiel --typescript --tailwind --app
   cd schweizer-lernspiel
   npm install framer-motion@10.16.4 zustand@4.4.1 howler@2.2.4 lucide-react@0.292.0 @radix-ui/react-dialog@1.0.5
   npm install -D @types/howler@2.2.11
   ```

2. **Design-System erstellen** ✅
   - Farbpalette definieren (Schweizer Farben + kinderfreundlich)
   - Typography-System
   - Spacing & Layout-Grid
   - Basis-Komponenten (Button, Card, Modal)

3. **Routing-Struktur** ✅
   - Home/Landing Page
   - Spielauswahl
   - Einzelne Spiele
   - Fortschritts-Dashboard

4. **Audio-System** ✅
   - Background-Musik Manager
   - Sound-Effekte System
   - Audio-Einstellungen

### Phase 2: Core Game Engine (Woche 2-3) ✅ ABGESCHLOSSEN

#### Komponenten zu entwickeln:

```typescript
// Beispiel Game Engine Struktur
interface GameEngine {
  score: number;
  level: number;
  lives: number;
  achievements: Achievement[];
  
  startGame(): void;
  endGame(): void;
  updateScore(points: number): void;
  nextLevel(): void;
}
```

#### Features: ✅ ALLE IMPLEMENTIERT
- Punkte-System mit Animationen ✅
- Level-Progression ✅
- Belohnungssystem (Sterne, Abzeichen) ✅
- Speicherung des Fortschritts (localStorage) ✅
- Fehler-Toleranz für Kinder ✅
- State Management mit Zustand ✅
- Achievement-System ✅
- Audio-Integration ✅
- Auto-Save Funktionalität ✅

### Phase 3: Erste Minispiele (Woche 4-5)

#### 1. Buchstaben-Berg (Lesen & Schreiben)
```typescript
Features:
- Drag & Drop Buchstaben
- Wort-Bild-Zuordnung
- Fortschrittsanzeige als Bergsteiger
- Belohnungsanimationen
```

#### 2. Zahlen-Express (Mathematik)
```typescript
Features:
- Zahlen 1-20 erkennen
- Einfache Addition/Subtraktion
- Visuelles Feedback
- Adaptive Schwierigkeit
```

#### 3. Tier-Safari (Natur & Umwelt)
```typescript
Features:
- Memory-Spiel mit Schweizer Tieren
- Informationskarten
- Tiergeräusche
- Sammelalbum
```

### Phase 4: Erweiterte Features (Woche 6-7)

#### Animationen & Polish
- **Mikrointeraktionen**: Hover-Effekte, Click-Feedback
- **Übergangsanimationen**: Smooth Page Transitions
- **Partikeleffekte**: Konfetti, Sterne, Schnee
- **Character-Animationen**: Maskottchen mit Lottie

#### Design-Highlights
```css
/* Beispiel: Glassmorphismus-Effekt */
.game-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* Beispiel: Smooth Animations */
.character {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
```

### Phase 5: Erweiterte Spiele (Woche 8)

#### Weitere Minispiele:
1. **Alphorn-Melodie** (Musik)
   - Einfache Melodien nachspielen
   - Rhythmus-Übungen
   - Instrumentenkunde

2. **Kantone-Puzzle** (Geografie)
   - Schweizer Karte zusammensetzen
   - Hauptstädte lernen
   - Sehenswürdigkeiten entdecken

3. **Jahreszeiten-Rad** (Zeit & Natur)
   - Jahreszeiten zuordnen
   - Wetterphänomene
   - Aktivitäten pro Jahreszeit

### Phase 6: Testing & Optimierung (Woche 9-10)

#### Testing-Strategie:
1. **Unit Tests** für Game Logic
2. **Integration Tests** für Spielabläufe
3. **Usability Testing** mit Zielgruppe
4. **Performance Testing** auf verschiedenen Geräten

#### Optimierungen:
- Code-Splitting für schnellere Ladezeiten
- Lazy Loading für Bilder und Audio
- Progressive Web App (PWA) Features
- Offline-Funktionalität

## Key Features für beeindruckendes Design

### 1. Animierter Startbildschirm
```typescript
// Beispiel: Animierte Berglandschaft mit Parallax
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, stagger: 0.2 }}
>
  {/* Mehrschichtige Berglandschaft */}
</motion.div>
```

### 2. Interaktives Maskottchen
- KI-gestütztes Verhalten
- Emotionale Reaktionen
- Hilfestellungen
- Easter Eggs

### 3. Adaptive Farbpalette
```typescript
// Tag/Nacht-Modus basierend auf Tageszeit
const timeOfDay = new Date().getHours();
const theme = timeOfDay < 18 ? 'day' : 'night';
```

### 4. Gamification-Elemente
- Tägliche Herausforderungen
- Sammelbares Inventar
- Freischaltbare Inhalte
- Soziale Features (Teilen mit Familie)

## Deployment & Maintenance

### Hosting-Optionen:
1. **Vercel** (empfohlen für Next.js)
2. **Netlify**
3. **Railway**

### CI/CD Pipeline:
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: pnpm install
      - run: pnpm test
      - run: pnpm build
      - uses: vercel/action@v3
```

## Erweiterungsmöglichkeiten

### Zukünftige Features:
1. **Eltern-Dashboard**
   - Fortschrittsverfolgung
   - Lernstatistiken
   - Zeitlimits

2. **Multiplayer-Modus**
   - Gemeinsames Lernen
   - Wettbewerbe
   - Kooperative Spiele

3. **KI-Integration**
   - Adaptive Schwierigkeit
   - Personalisierte Übungen
   - Spracherkennung

4. **Mobile App**
   - React Native Version
   - Offline-Modus
   - Push-Benachrichtigungen

## Ressourcen & Assets

### Benötigte Assets:
- Charakterdesigns (Hauptmaskottchen + NPCs)
- Hintergrundillustrationen (Schweizer Landschaften)
- UI-Elemente (Buttons, Icons, Badges)
- Soundeffekte (50-70 verschiedene)
- Hintergrundmusik (5-10 Tracks)
- Sprachaufnahmen (Instruktionen, Feedback)

### Design-Inspiration:
- Schweizer Grafikdesign-Tradition
- Moderne Kinderbuch-Illustrationen
- Gamification Best Practices
- Accessibility Guidelines

## Start-Befehle für Claude Code

```bash
# Hauptverzeichnis erstellen
mkdir schweizer-lernspiel
cd schweizer-lernspiel

# Frontend initialisieren
npx create-next-app@13.5.6 frontend --typescript --tailwind --app
cd frontend

# Frontend Dependencies installieren
npm install framer-motion@10.16.4 zustand@4.4.1 howler@2.2.4 lucide-react@0.292.0 @radix-ui/react-dialog@1.0.5
npm install -D @types/howler@2.2.11 @types/node@18.19.3 eslint@8.55.0 prettier@3.1.0

# Backend Setup
mkdir -p backend
cd backend
npm init -y
npm install express@4.18.2 cors@2.8.5 helmet@7.1.0 dotenv@16.3.1 jsonwebtoken@9.0.2
npm install prisma@5.7.0 @prisma/client@5.7.0 bcryptjs@2.4.3 joi@17.11.0
npm install -D @types/express@4.17.21 @types/cors@2.8.17 @types/bcryptjs@2.4.6 typescript@5.3.3 ts-node@10.9.2 nodemon@3.0.2

# Database Setup
npx prisma init

# Entwicklungsserver starten
cd ../frontend && npm run dev

# Frontend Projekt-Struktur erstellen
cd frontend
mkdir -p src/{components/{ui,game,animations,layout},lib/{game-engine,audio,animations,utils},hooks,store,types,styles}
mkdir -p public/{audio,images,animations}

# Backend Projekt-Struktur erstellen
cd ../backend
mkdir -p src/{api/{auth,users,games,progress},middleware,services,models,utils,config}
mkdir -p tests/{unit,integration}

# Shared Types
cd ..
mkdir -p shared/types
```

## Docker Setup für lokale Entwicklung

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: lernspiel_user
      POSTGRES_PASSWORD: lernspiel_pass
      POSTGRES_DB: lernspiel_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

## Environment Variables Setup

```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000

# backend/.env
NODE_ENV=development
PORT=3001
DATABASE_URL="postgresql://lernspiel_user:lernspiel_pass@localhost:5432/lernspiel_db"
REDIS_URL="redis://localhost:6379"
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
```

## Erste Implementierungsschritte

1. **Backend Setup**
   - Prisma Schema definieren
   - Express Server konfigurieren
   - API Routes erstellen
   - Authentifizierung implementieren

2. **Frontend Setup**
   - Design-System in `frontend/src/styles/globals.css`
   - API Client Setup
   - Basis-Layout in `frontend/src/app/layout.tsx`
   - Landing Page mit Animationen

3. **Integration**
   - Frontend-Backend Verbindung testen
   - Authentifizierungs-Flow
   - Erste Game-Komponente

Viel Erfolg bei der Implementierung!