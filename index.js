require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const planSchema = new mongoose.Schema({
  id: Number,
  name: String,
});
const Plan = mongoose.model('Plan', planSchema);

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Получить все планы
    app.get('/plans', async (req, res) => {
      const plans = await Plan.find();
      res.json(plans);
    });

    // Добавить новый план
    app.post('/plans', async (req, res) => {
      const plan = new Plan(req.body);
      await plan.save();
      res.status(201).json(plan);
    });

    // Обновить план по id
    app.put('/plans/:id', async (req, res) => {
      const id = req.params.id;
      const updateData = req.body;
      try {
        const updatedPlan = await Plan.findOneAndUpdate({ id: id }, updateData, { new: true });
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
      const id = req.params.id;
      try {
        const deletedPlan = await Plan.findOneAndDelete({ id: id });
        if (!deletedPlan) {
          return res.status(404).json({ message: 'Plan not found' });
        }
        res.json({ message: 'Plan deleted' });
      } catch (error) {
        res.status(400).json({ message: error.message });
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
