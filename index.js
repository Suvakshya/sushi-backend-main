// index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from '../backend/src/config/connection.js';

// Import routes
import userRoutes from '../backend/src/routes/userRoutes.js';
import menuRoutes from '../backend/src/routes/menuItemRoutes.js';
import orderRoutes from '../backend/src/routes/orderRoutes.js';
import orderItemRoutes from '../backend/src/routes/orderItemRoutes.js';
import deliveryInfoRoutes from '../backend/src/routes/deliveryInfoRoutes.js';
import adminRoutes from '../backend/src/routes/adminRoutes.js';
import contactRoutes from "../backend/src/routes/contactRoutes.js"
import termsAndConditionsRoutes from "../backend/src/routes/termsAndConditionsRoutes.js";
import privatePolicyRoutes from "../backend/src/routes/privatePolicyRoutes.js";
import faqRoutes from "../backend/src/routes/faqRoutes.js";
import sliderRoutes from '../backend/src/routes/sliderRoutes.js';
import blogRoutes from '../backend/src/routes/blogRoutes.js';



dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URI || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Database connection
connectDB();

// Routes
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/menu', menuRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/termsandconditions', termsAndConditionsRoutes); 
app.use('/api/v1/privatepolicy', privatePolicyRoutes);
app.use('/api/v1/faq', faqRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/order-items', orderItemRoutes);
app.use('/api/v1/delivery-info', deliveryInfoRoutes);
app.use('/api/v1/sliders', sliderRoutes);
app.use('/api/v1/blogs', blogRoutes);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running successfully',
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});