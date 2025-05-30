require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const plansRouter = require('./routes/plans.routes');

const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use('/plans', plansRouter);

async function connectDB() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MongoDB connection string is not defined');
    }
    
    // Логируем только начало URI для безопасности
    console.log('Connecting to MongoDB with URI:', mongoUri.substring(0, mongoUri.indexOf('@')+1) + '...');
    
    await mongoose.connect(mongoUri, {
      retryWrites: true,
      w: 'majority',
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000
    });
    console.log('✅ Успешное подключение к MongoDB');
  } catch (e) {
    console.error('Ошибка подключения к MongoDB:', e.message);
    process.exit(1);
  }
}

module.exports = { app, connectDB };
