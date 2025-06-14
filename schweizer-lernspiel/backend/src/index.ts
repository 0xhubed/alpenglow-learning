import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Swiss Learning Game Backend is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.get('/api', (req, res) => {
  res.json({
    message: 'Swiss Learning Game API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      users: '/api/users',
      games: '/api/games',
      progress: '/api/progress'
    }
  });
});

// Placeholder API routes
app.use('/api/auth', (req, res) => {
  res.json({ message: 'Auth endpoints coming soon' });
});

app.use('/api/users', (req, res) => {
  res.json({ message: 'User endpoints coming soon' });
});

app.use('/api/games', (req, res) => {
  res.json({ message: 'Game endpoints coming soon' });
});

app.use('/api/progress', (req, res) => {
  res.json({ message: 'Progress endpoints coming soon' });
});

// Error handling
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Swiss Learning Game Backend running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`🔧 API: http://localhost:${PORT}/api`);
  console.log(`🏔️ Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;