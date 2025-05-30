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
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ Успешное подключение к MongoDB');
  } catch (e) {
    console.error('Ошибка подключения к MongoDB:', e.message);
    process.exit(1);
  }
}

module.exports = { app, connectDB };
