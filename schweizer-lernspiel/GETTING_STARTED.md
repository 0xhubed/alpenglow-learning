# 🚀 Getting Started - Schweizer Abenteuerland

Vollständige Anleitung zum Starten der Swiss Learning Game Anwendung.

## 📋 Voraussetzungen

Bevor Sie beginnen, stellen Sie sicher, dass folgendes installiert ist:

- **Node.js 18.14.2 oder höher** ([Download](https://nodejs.org/))
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop/))
- **WSL2 (Windows Subsystem for Linux)** - falls auf Windows
- **Git** ([Download](https://git-scm.com/))

## ⚠️ WICHTIG: WSL vs Windows

> **Dieses Projekt MUSS in WSL (Linux-Umgebung) ausgeführt werden, NICHT in Windows CMD/PowerShell!**

### WSL Terminal öffnen:
- **Option 1**: `Win + R` → `wsl` → Enter
- **Option 2**: Windows Terminal → Ubuntu/WSL Tab
- **Option 3**: VS Code mit WSL Extension

### Überprüfen, ob Sie in WSL sind:
```bash
# Sie sollten sehen:
hubed@computer:/home/hubed$ 

# NICHT:
C:\Users\Name>
```

## 🏁 Schnellstart (Copy & Paste)

### 1. Projekt-Verzeichnis öffnen
```bash
cd /home/hubed/projects/alpenglow-learning/schweizer-lernspiel
```

### 2. Docker-Services starten
```bash
# PostgreSQL und Redis Container starten
docker-compose up -d

# Überprüfen, ob Container laufen
docker ps
```

**Erwartete Ausgabe:**
```
CONTAINER ID   IMAGE              PORTS                    NAMES
xxxxx          postgres:15-alpine 0.0.0.0:5432->5432/tcp   schweizer-lernspiel-postgres-1
xxxxx          redis:7-alpine     0.0.0.0:6379->6379/tcp   schweizer-lernspiel-redis-1
```

### 3. Backend starten (Terminal 1)
```bash
# Ins Backend-Verzeichnis wechseln
cd backend

# Dependencies installieren (falls noch nicht geschehen)
npm install

# Prisma Client generieren
npx prisma generate

# Optional: Datenbank-Schema erstellen
npx prisma migrate dev --name init

# Backend-Server starten
npm run dev
```

**Erwartete Ausgabe:**
```
Server läuft auf Port 3001
Datenbank verbunden
```

### 4. Frontend starten (Terminal 2 - Neues WSL Terminal)
```bash
# Ins Frontend-Verzeichnis wechseln
cd /home/hubed/projects/alpenglow-learning/schweizer-lernspiel/frontend

# Dependencies installieren (falls noch nicht geschehen)
npm install

# Frontend-Server starten
npm run dev
```

**Erwartete Ausgabe:**
```
▲ Next.js 13.5.6
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000

✓ Ready in 2.3s
```

## 🌐 Anwendung öffnen

1. **Browser öffnen**
2. **Zu http://localhost:3000 navigieren**
3. **Die Schweizer Abenteuerland Startseite sollte erscheinen**

## 🎮 Was Sie testen können

### ✅ Verfügbare Features:

1. **Startseite**
   - Animierte Berglandschaft
   - Schwebende Hintergrund-Elemente
   - "Spiel starten" Button (mit Klick-Sound)
   - Feature-Karten für verschiedene Lernbereiche

2. **Spiele-Auswahl**
   - Klicken Sie "Spiel starten" auf der Startseite
   - Interaktive Spiel-Karten mit Hover-Effekten
   - 3 verfügbare Spiele + 1 "Bald verfügbar"
   - "Zurück" Navigation

3. **Audio-System**
   - Klick-Sounds bei Buttons
   - Hintergrundmusik (falls Audio-Dateien vorhanden)
   - Lautstärke-Einstellungen im Browser

4. **Design-System**
   - Schweizer Farbschema
   - Responsive Layout
   - Smooth Animationen

## 🛠️ Entwicklungskommandos

### Frontend (im `/frontend` Verzeichnis):
```bash
npm run dev          # Entwicklungsserver starten
npm run build        # Produktions-Build erstellen
npm run start        # Produktionsserver starten
npm run lint         # Code-Linting ausführen
```

### Backend (im `/backend` Verzeichnis):
```bash
npm run dev          # Entwicklungsserver starten
npx prisma studio    # Datenbank-Admin-UI öffnen
npx prisma migrate dev  # Neue Migrationen ausführen
npx prisma generate  # Prisma Client neu generieren
```

### Docker:
```bash
docker-compose up -d    # Services im Hintergrund starten
docker-compose down     # Services stoppen
docker-compose logs     # Logs anzeigen
docker ps              # Laufende Container anzeigen
```

## 🔍 Fehlerbehebung

### ❌ Frontend startet nicht
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### ❌ "next is not recognized"
- **Problem**: Sie sind in Windows CMD statt WSL
- **Lösung**: WSL Terminal öffnen und von dort starten

### ❌ Docker Container starten nicht
```bash
# Container stoppen und neu starten
docker-compose down
docker-compose up -d --force-recreate

# Docker Desktop überprüfen
# Stellen Sie sicher, dass Docker Desktop läuft
```

### ❌ Port bereits in Verwendung
```bash
# Prozess auf Port 3000 finden und beenden
sudo lsof -i :3000
sudo kill -9 <PID>

# Oder anderen Port verwenden
npm run dev -- -p 3001
```

### ❌ Datenbank-Verbindungsfehler
```bash
# Überprüfen, ob PostgreSQL Container läuft
docker ps | grep postgres

# Container-Logs prüfen
docker-compose logs postgres

# Neustart des Containers
docker-compose restart postgres
```

### ❌ Audio funktioniert nicht
- Audio-Dateien müssen in `/frontend/public/audio/` hinzugefügt werden
- Moderne Browser benötigen Benutzerinteraktion vor Audio-Wiedergabe
- Browser-Konsole auf Audio-Ladefehler überprüfen

## 🌍 URLs im Überblick

| Service | URL | Beschreibung |
|---------|-----|--------------|
| Frontend | http://localhost:3000 | Hauptanwendung |
| Backend API | http://localhost:3001 | REST API |
| Prisma Studio | http://localhost:5555 | Datenbank-Admin (nach `npx prisma studio`) |
| PostgreSQL | localhost:5432 | Datenbank-Server |
| Redis | localhost:6379 | Cache-Server |

## 🔧 VS Code Setup (Empfohlen)

1. **WSL Extension installieren**
2. **Remote - WSL Extension installieren**
3. **Projekt in WSL öffnen**:
   ```
   Ctrl + Shift + P → "WSL: Connect to WSL"
   Datei → Ordner öffnen → /home/hubed/projects/alpenglow-learning/schweizer-lernspiel
   ```
4. **Integrierte Terminals verwenden** (automatisch WSL-Kontext)

## 📊 Systemanforderungen

- **RAM**: Mindestens 4GB (8GB empfohlen)
- **CPU**: Dual-Core (Quad-Core empfohlen)
- **Speicher**: 2GB freier Festplattenspeicher
- **Browser**: Chrome, Firefox, Safari, Edge (moderne Versionen)

## 🎯 Nächste Schritte

Nach erfolgreichem Start können Sie:

1. **Code erkunden** in VS Code
2. **Neue Features entwickeln** (Phase 3: Minispiele)
3. **Database Schema anpassen** mit Prisma
4. **UI-Komponenten erweitern**

## 💡 Tipps

- **Immer WSL verwenden** für dieses Linux-basierte Projekt
- **Docker Desktop** sollte vor dem Start laufen
- **Browser-Entwicklertools** nutzen für Debugging
- **Hot Reload** funktioniert automatisch bei Dateiänderungen

---

**Bei Problemen**: Überprüfen Sie die Terminal-Ausgaben auf Fehlermeldungen und stellen Sie sicher, dass Sie in WSL arbeiten!