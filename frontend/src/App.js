import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

function App() {
  const [plans, setPlans] = useState([]);
  const [plan, setPlan] = useState({ name: '' });
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const toast = React.useRef(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get('http://localhost:3000/plans');
      setPlans(response.data);
    } catch (error) {
      showError('Ошибка при загрузке планов');
    }
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        await axios.put(`http://localhost:3000/plans/${selectedPlan._id}`, plan);
        showSuccess('План успешно обновлен');
      } else {
        await axios.post('http://localhost:3000/plans', plan);
        showSuccess('План успешно добавлен');
      }
      setVisible(false);
      setPlan({ name: '' });
      fetchPlans();
    } catch (error) {
      showError('Ошибка при сохранении плана');
    }
  };

  const handleEdit = (rowData) => {
    setPlan({ name: rowData.name });
    setSelectedPlan(rowData);
    setEditing(true);
    setVisible(true);
  };

  const handleDelete = async (rowData) => {
    try {
      await axios.delete(`http://localhost:3000/plans/${rowData._id}`);
      showSuccess('План успешно удален');
      fetchPlans();
    } catch (error) {
      showError('Ошибка при удалении плана');
    }
  };

  const showSuccess = (message) => {
    toast.current.show({
      severity: 'success',
      summary: 'Успешно',
      detail: message,
      life: 3000
    });
  };

  const showError = (message) => {
    toast.current.show({
      severity: 'error',
      summary: 'Ошибка',
      detail: message,
      life: 3000
    });
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success"
          onClick={() => handleEdit(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          onClick={() => handleDelete(rowData)}
        />
      </div>
    );
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <div className="flex justify-content-between align-items-center mb-4">
        <h1>Управление планами</h1>
        <Button
          label="Добавить план"
          icon="pi pi-plus"
          onClick={() => {
            setPlan({ name: '' });
            setEditing(false);
            setVisible(true);
          }}
        />
      </div>

      <DataTable
        value={plans}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25]}
        tableStyle={{ minWidth: '50rem' }}
      >
        <Column field="name" header="Название" sortable />
        <Column body={actionBodyTemplate} header="Действия" />
      </DataTable>

      <Dialog
        visible={visible}
        onHide={() => setVisible(false)}
        header={editing ? 'Редактировать план' : 'Добавить план'}
      >
        <div className="p-fluid">
          <div className="field">
            <label htmlFor="name">Название</label>
            <InputText
              id="name"
              value={plan.name}
              onChange={(e) => setPlan({ ...plan, name: e.target.value })}
              required
            />
          </div>
          <Button
            label={editing ? 'Обновить' : 'Сохранить'}
            icon="pi pi-check"
            onClick={handleSubmit}
            className="mt-2"
          />
        </div>
      </Dialog>
    </div>
  );
}

export default App;
