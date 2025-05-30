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
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/testdb';
    console.log('Connecting to MongoDB with URI:', mongoUri);
    
    await mongoose.connect(mongoUri, {
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
