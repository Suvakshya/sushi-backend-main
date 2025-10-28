// index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/connection.js';

// Import routes
import userRoutes from './src/routes/userRoutes.js';
import menuRoutes from './src/routes/menuItemRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';
import orderItemRoutes from './src/routes/orderItemRoutes.js';
import deliveryInfoRoutes from './src/routes/deliveryInfoRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import contactRoutes from "./src/routes/contactRoutes.js"
import termsAndConditionsRoutes from "./src/routes/termsAndConditionsRoutes.js";
import privatePolicyRoutes from "./src/routes/privatePolicyRoutes.js";
import faqRoutes from "./src/routes/faqRoutes.js";
import sliderRoutes from './src/routes/sliderRoutes.js';
import blogRoutes from './src/routes/blogRoutes.js';
import cartRoutes from './src/routes/cartRoutes.js';
import translationRoutes from './src/routes/translationRoutes.js';
import stripeRoutes from './src/routes/stripeRoutes.js';
import receiptsRoutes from './src/routes/receipts.js';
import admincontactRoutes from './src/routes/adminContactRoutes.js';
import applicantRoutes from './src/routes/applicantRoutes.js';
import logoLinkRoutes from './src/routes/logoLinkRoutes.js';





dotenv.config();

const app = express();


// const allowedOrigins = [
//   "http://localhost:3000",
//   "http://localhost:3001",
//   "https://sushi-frontend-main.vercel.app",
//   "https://sushi-frontend-main-azvj.vercel.app"
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // ✅ allow requests with no origin (like mobile apps, curl, SSR)
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       } else {
//         console.error("❌ Blocked by CORS:", origin);
//         return callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

app.use(cors());

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
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/translate', translationRoutes);
app.use('/api/v1/stripe', stripeRoutes);
app.use('/api/v1/receipts', receiptsRoutes);
app.use('/api/v1/admincontact', admincontactRoutes);
app.use('/api/v1/applicants', applicantRoutes);
app.use('/api/v1/logo', logoLinkRoutes);



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