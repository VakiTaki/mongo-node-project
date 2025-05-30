require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const Plan = require('./models/Plan');

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Получить все планы
    app.get('/plans', async (req, res) => {
      const plans = await Plan.find();
      res.json(plans);
    });

    // Получить план по ID
    app.get('/plans/:id', async (req, res) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
          return res.status(400).json({ message: 'Invalid ID format' });
        }
        const plan = await Plan.findById(req.params.id);
        if (!plan) {
          return res.status(404).json({ message: 'Plan not found' });
        }
        res.json(plan);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    // Добавить новый план
    app.post('/plans', async (req, res) => {
      const plan = new Plan(req.body);
      await plan.save();
      res.status(201).json(plan);
    });

    // Полное обновление плана (PUT)
    app.put('/plans/:id', async (req, res) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
          return res.status(400).json({ message: 'Invalid ID format' });
        }
        if (!req.body.name) {
          return res.status(400).json({ message: 'Name is required' });
        }
        
        const updatedPlan = await Plan.findByIdAndUpdate(
          req.params.id,
          { $set: req.body },
          { new: true, runValidators: true }
        );
        
        if (!updatedPlan) {
          return res.status(404).json({ message: 'Plan not found' });
        }
        res.json(updatedPlan);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    });

    // Частичное обновление плана (PATCH)
    app.patch('/plans/:id', async (req, res) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
          return res.status(400).json({ message: 'Invalid ID format' });
        }
        const updatedPlan = await Plan.findByIdAndUpdate(
          req.params.id,
          { $set: req.body },
          { new: true, runValidators: true }
        );
        
        if (!updatedPlan) {
          return res.status(404).json({ message: 'Plan not found' });
        }
        res.json(updatedPlan);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    });

    // Удалить план по id
    app.delete('/plans/:id', async (req, res) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
          return res.status(400).json({ message: 'Invalid ID format' });
        }
        const deletedPlan = await Plan.findByIdAndDelete(req.params.id);
        if (!deletedPlan) {
          return res.status(404).json({ message: 'Plan not found' });
        }
        res.json({ 
          message: 'Plan deleted successfully',
          deletedPlan: deletedPlan 
        });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
    });
  } catch (e) {
    console.error(e);
  }
}

start();
