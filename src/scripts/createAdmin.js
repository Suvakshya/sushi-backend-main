import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Admin from '../models/adminModel.js';

// Calculate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure dotenv with explicit path
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Debug: Check if environment variable is loaded
console.log('MONGO_URI:', process.env.MONGO_URI ? '✓ Loaded' : '✗ Undefined');

const createAdmin = async () => {
  try {
    // Check if MONGO_URI is defined before attempting to connect
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    console.log('🔗 Attempting to connect to MongoDB...');
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB successfully');

    const username = 'admin';
    const password = 'admin123';

    const existing = await Admin.findOne({ username });
    if (existing) {
      console.log('ℹ️ Admin already exists.');
      await mongoose.connection.close();
      process.exit();
    }

    const newAdmin = new Admin({
      username,
      password_hash: password
    });

    await newAdmin.save();
    console.log('✅ Admin created successfully');
    
    await mongoose.connection.close();
    process.exit();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

createAdmin();