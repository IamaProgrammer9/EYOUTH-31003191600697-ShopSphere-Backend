import express, { Request, Response } from 'express';
import authRoutes from "./routes/auth.js";
import productsRoutes from "./routes/products.js";
import cartRoutes from "./routes/cart.js";
import healthRoutes from "./routes/health.js";
import cookieParser from "cookie-parser";
import * as helmet from 'helmet';
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import axios from "axios";
import morgan from 'morgan';

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 150,
    standardHeaders: 'draft-8',
    legacyHeaders: true,
    ipv6Subnet: 60,
})

app.use(morgan('dev')); 

// Security middleware
app.use(limiter);
app.use(helmet.default({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
// Other middleware
app.use(cookieParser());
app.use(express.json());
// File middleware
app.use('/uploads', express.static('../public/uploads'));

const allowedOrigins = [
  'https://nile-bridge.vercel.app',
  'http://localhost:5173',
  'http://localhost:5200',
  'https://nile-bridge-review-service.vercel.app'
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);

    // Normalize origin by removing potential trailing slashes
    const normalizedOrigin = origin.replace(/\/$/, '');

    if (allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Apply CORS globally before defined routes
app.use(cors(corsOptions));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/health', healthRoutes);

app.post('/api/analytics', async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Request recieved, background task offloaded'});

  const vercelAppUUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://nile-bridge-backend.vercel.app';

  axios.post(`${vercelAppUUrl}/api/analytics`).then((res) => {
    console.log('Serverless response', res.data);
  }).catch((err) => {
    console.log('Serverless error', err.message);
  })
})

export default app;