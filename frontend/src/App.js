import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [plans, setPlans] = useState([]);
  const [newPlan, setNewPlan] = useState({ name: '' });
  const [editingPlan, setEditingPlan] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    const response = await axios.get('http://localhost:3000/plans');
    setPlans(response.data);
  };

  const handleInputChange = (e) => {
    setNewPlan({ ...newPlan, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingPlan) {
      await axios.put(`http://localhost:3000/plans/${editingPlan._id}`, newPlan);
    } else {
      await axios.post('http://localhost:3000/plans', newPlan);
    }
    setNewPlan({ name: '' });
    setEditingPlan(null);
    fetchPlans();
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setNewPlan({ name: plan.name });
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3000/plans/${id}`);
    fetchPlans();
  };

  return (
    <div className="container">
      <h1>Управление планами</h1>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={newPlan.name}
          onChange={handleInputChange}
          placeholder="Название плана"
          required
        />
        <button type="submit">
          {editingPlan ? 'Обновить' : 'Добавить'}
        </button>
      </form>

      <ul>
        {plans.map(plan => (
          <li key={plan._id}>
            {plan.name}
            <button onClick={() => handleEdit(plan)}>Редактировать</button>
            <button onClick={() => handleDelete(plan._id)}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
