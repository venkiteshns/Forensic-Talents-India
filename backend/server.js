import 'dotenv/config';
import dns from 'dns';

// Force Node to use IPv4 first
dns.setDefaultResultOrder("ipv4first");

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import startKeepAlive from './utils/keepAlive.js';
import { startCronJobs } from './utils/cronJobs.js';

const app = express();
const port = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start Keep-Alive Ping
startKeepAlive();

// Start Cron Jobs
startCronJobs();

// Start Server
app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
