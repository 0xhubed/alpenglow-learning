# Schweizer Abenteuerland

Ein interaktives Lernspiel für Erstklässler (6-7 Jahre) mit Schweizer Themen und Kultur.

## 🎯 Projektübersicht

**Zielgruppe**: Erstklässler (6-7 Jahre)  
**Plattform**: Web-basiert (Desktop & Tablet optimiert)  
**Entwicklungsdauer**: 8-10 Wochen  

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Sprache**: TypeScript
- **Styling**: Tailwind CSS + CSS Modules
- **UI-Komponenten**: Radix UI + Custom Components
- **Animationen**: Framer Motion, React Spring, Lottie
- **State Management**: Zustand
- **Audio**: Howler.js
- **Icons**: Lucide React

### Development Tools
- **Build Tool**: Vite
- **Linting**: ESLint + Prettier
- **Testing**: Jest, React Testing Library, Playwright
- **Package Manager**: pnpm

## 🎮 Geplante Minispiele

1. **Buchstaben-Berg** - Lesen & Schreiben mit Drag & Drop
2. **Zahlen-Express** - Mathematik (1-20, Addition/Subtraktion)
3. **Tier-Safari** - Memory mit Schweizer Tieren
4. **Alphorn-Melodie** - Musik & Rhythmus
5. **Kantone-Puzzle** - Schweizer Geografie
6. **Jahreszeiten-Rad** - Zeit & Natur

## 🚀 Setup

```bash
# Projekt initialisieren
npx create-next-app@latest schweizer-lernspiel --typescript --tailwind --app
cd schweizer-lernspiel

# Dependencies installieren
pnpm add framer-motion zustand howler lucide-react @radix-ui/react-dialog
pnpm add -D @types/howler

# Entwicklungsserver starten
pnpm dev
```

## 📁 Projektstruktur

```
src/
├── app/                    # Next.js App Router
│   ├── spiele/            # Einzelne Spiele
│   └── profil/            # Benutzer-Dashboard
├── components/
│   ├── ui/                # Basis UI-Komponenten
│   ├── game/              # Spiel-spezifische Komponenten
│   ├── animations/        # Animationskomponenten
│   └── layout/            # Layout-Komponenten
├── lib/
│   ├── game-engine/       # Spiel-Logik
│   ├── audio/             # Audio-Management
│   └── utils/             # Utilities
├── hooks/                 # Custom React Hooks
├── store/                 # Zustand Store
└── types/                 # TypeScript Types
```

## ✨ Key Features

- **Animierter Startbildschirm** mit Schweizer Berglandschaft
- **Interaktives Maskottchen** mit emotionalen Reaktionen
- **Gamification-Elemente** (Punkte, Achievements, Sammelalbum)
- **Adaptive Schwierigkeit** für individuelle Förderung
- **Audio-System** mit Soundeffekten und Hintergrundmusik
- **Progressive Web App** mit Offline-Funktionalität

## 🎨 Design-Prinzipien

- Schweizer Farben und Kultur
- Kinderfreundliche Animationen
- Accessibility-First Ansatz
- Glassmorphismus-Effekte
- Mikrointeraktionen für bessere UX

## 📈 Implementierungsphasen

1. **Woche 1**: Projekt-Setup & Grundstruktur
2. **Woche 2-3**: Core Game Engine
3. **Woche 4-5**: Erste Minispiele
4. **Woche 6-7**: Erweiterte Features & Animationen
5. **Woche 8**: Weitere Spiele
6. **Woche 9-10**: Testing & Optimierung

## 🚢 Deployment

- **Hosting**: Vercel (empfohlen)
- **CI/CD**: GitHub Actions
- **PWA**: Service Worker für Offline-Modus

## 📝 Lizenz

Siehe [LICENSE](LICENSE) Datei für Details.