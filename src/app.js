require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const plansRouter = require('./routes/plans.routes');

const app = express();

app.use(express.json());
app.use('/plans', plansRouter);

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
  } catch (e) {
    console.error('MongoDB connection error:', e);
    process.exit(1);
  }
}

module.exports = { app, connectDB };
