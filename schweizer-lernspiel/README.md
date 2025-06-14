# 🏔️ Schweizer Lernspiel (Swiss Learning Game)

A comprehensive educational game platform designed for Swiss first-graders (ages 6-7) to learn letters, numbers, nature, and music in an engaging, interactive environment.

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.14.2 or higher
- **Docker** and **Docker Compose**
- **Git**

### Start Development Environment

```bash
# Clone and navigate to the project
cd schweizer-lernspiel

# Start everything (Docker, Backend, Frontend)
./start-dev.sh
```

### Stop Development Environment

```bash
# Stop all services
./stop-dev.sh
```

## 🎮 What's Included

### ✅ Implemented Games (Phase 3)

1. **🏔️ Buchstaben-Berg (Letter Mountain)**
   - Interactive drag & drop letter learning
   - Swiss-themed vocabulary building
   - Progressive difficulty with hints
   - Word-picture matching challenges

2. **🚂 Zahlen-Express (Number Express)**
   - Adaptive math problems (counting, addition, subtraction)
   - Visual learning with interactive elements
   - Train-themed interface
   - Streak tracking and achievements

3. **🦌 Tier-Safari (Animal Safari)**
   - Memory card matching game
   - Swiss wildlife education
   - Animal facts and information cards
   - Collection progress tracking

### 🔧 Technical Features

- **Game Engine**: Unified scoring, achievements, and progress tracking
- **Responsive Design**: Works on desktop and tablet
- **Animations**: Smooth Framer Motion animations throughout
- **Audio Integration**: Sound effects and background music support
- **Progress Saving**: Local storage for game progress
- **Child-Friendly**: Error tolerance and encouraging feedback

## 📁 Project Structure

```
schweizer-lernspiel/
├── frontend/                 # Next.js 13.5 Frontend
│   ├── app/                 # App Router pages
│   │   ├── spiele/         # Game pages
│   │   │   ├── buchstaben/ # Letter Mountain game
│   │   │   ├── zahlen/     # Number Express game
│   │   │   └── natur/      # Animal Safari game
│   │   └── ...
│   ├── components/         # Reusable UI components
│   ├── lib/               # Game engine and utilities
│   └── store/             # Zustand state management
├── backend/               # Express.js Backend
│   ├── src/              # TypeScript source
│   ├── prisma/           # Database schema
│   └── tests/            # Backend tests
├── shared/               # Shared types and interfaces
├── docker-compose.yml    # PostgreSQL + Redis services
├── start-dev.sh         # Start all services
└── stop-dev.sh          # Stop all services
```

## 🛠️ Manual Setup (Alternative)

If you prefer to start services manually:

### 1. Start Docker Services

```bash
docker-compose up -d
```

### 2. Start Backend

```bash
cd backend

# Create .env file
cat > .env << 'EOF'
NODE_ENV=development
PORT=3001
DATABASE_URL="postgresql://lernspiel_user:lernspiel_pass@localhost:5432/lernspiel_db"
REDIS_URL="redis://localhost:6379"
JWT_SECRET=schweizer-lernspiel-dev-secret-key-2024
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
EOF

# Install dependencies and start
npm install
npx prisma migrate dev --name init
npx prisma generate
npm run dev
```

### 3. Start Frontend

```bash
cd frontend

# Create .env.local file
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF

# Install dependencies and start
npm install
npm run dev
```

## 🌐 Access Points

Once started, you can access:

- **🎮 Game Frontend**: http://localhost:3000
- **🔧 Backend API**: http://localhost:3001
- **💾 Database**: postgresql://localhost:5432/lernspiel_db
- **📊 Redis**: redis://localhost:6379

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests  
cd backend
npm test

# TypeScript checking
npm run type-check

# Linting
npm run lint
```

## 📦 Technology Stack

### Frontend
- **Framework**: Next.js 13.5 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Modules
- **Animations**: Framer Motion + React Spring
- **State**: Zustand
- **Audio**: Howler.js
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js 18.14.2
- **Framework**: Express.js 4.18
- **Database**: PostgreSQL 15 + Prisma ORM
- **Cache**: Redis 7
- **Auth**: JWT
- **Validation**: Joi

### DevOps
- **Containers**: Docker + Docker Compose
- **Development**: Hot reload for both frontend and backend
- **Build**: TypeScript compilation
- **Linting**: ESLint + Prettier

## 🎯 Game Features

### For Children (Ages 6-7)
- **Error Tolerance**: Multiple attempts encouraged
- **Visual Feedback**: Immediate positive reinforcement
- **Progressive Difficulty**: Starts easy, gradually increases
- **Hint System**: Helpful guidance when needed
- **Achievement System**: Stars, badges, and celebrations

### For Educators/Parents
- **Progress Tracking**: Local storage of game progress
- **Educational Content**: Swiss-themed learning materials
- **Accessibility**: Large buttons, clear fonts, simple navigation
- **Safe Environment**: No external links or data collection

## 🚧 Roadmap

### Phase 4: Advanced Features (Next)
- **Animations & Polish**: Particle effects, micro-interactions
- **Design Highlights**: Glassmorphism, character animations
- **Performance**: Code splitting, lazy loading

### Phase 5: Extended Games
- **🎺 Alphorn-Melodie**: Music rhythm game
- **🗺️ Kantone-Puzzle**: Swiss geography
- **🌸 Jahreszeiten-Rad**: Seasons and weather

### Future Enhancements
- **Parent Dashboard**: Progress reports and settings
- **Multiplayer Mode**: Family challenges
- **Mobile App**: React Native version
- **AI Integration**: Adaptive difficulty

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill processes on ports 3000 or 3001
sudo lsof -ti:3000 | xargs kill -9
sudo lsof -ti:3001 | xargs kill -9
```

**Docker issues:**
```bash
# Reset Docker services
docker-compose down -v
docker-compose up -d
```

**Database connection issues:**
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# View logs
docker-compose logs postgres
```

**Node modules issues:**
```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Look for existing issues in the repository
3. Create a new issue with detailed information

---

**Made with ❤️ for Swiss education** 🇨🇭