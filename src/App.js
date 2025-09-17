import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://todo-flask-duf3.onrender.com/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (err) {
      console.error("Görevler alınamadı:", err);
    }
  };

  const addTask = async () => {
    if (!newTask) return;
    await axios.post(API_URL, { title: newTask, status: "onay_bekliyor" });
    setNewTask("");
    fetchTasks();
  };

  const updateTask = async (id, status) => {
    await axios.put(`${API_URL}/${id}`, { status });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchTasks();
  };

  const pendingTasks = tasks.filter(t => t.status === "onay_bekliyor");
  const inProgressTasks = tasks.filter(t => t.status === "devam");
  const completedTasks = tasks.filter(t => t.status === "tamamlandı");

  const TaskCard = ({ task, buttons }) => (
    <div className="p-2 mb-2 border rounded flex justify-between items-center bg-white shadow-sm">
      <span className={task.status === "tamamlandı" ? "line-through text-green-700" : ""}>
        {task.title}
      </span>
      <div className="flex gap-1">{buttons}</div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-4 font-sans">
      <h1 className="text-2xl font-bold mb-4">Görev Listesi</h1>
      <div className="flex mb-4">
        <input
          className="flex-1 border p-2 rounded-l"
          placeholder="Yeni görev ekle"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600"
          onClick={addTask}
        >
          Ekle
        </button>
      </div>

      {/* Onay Bekleyen */}
      <h2 className="font-semibold mt-4">Onay Bekleyen</h2>
      {pendingTasks.map(t => (
        <TaskCard
          key={t.id}
          task={t}
          buttons={
            <>
              <button className="bg-yellow-400 px-2 rounded" onClick={() => updateTask(t.id, "devam")}>İkinci Aşama</button>
              <button className="bg-green-500 text-white px-2 rounded" onClick={() => updateTask(t.id, "tamamlandı")}>Tamamlandı</button>
              <button className="bg-red-500 text-white px-2 rounded" onClick={() => deleteTask(t.id)}>Sil</button>
            </>
          }
        />
      ))}

      {/* İkinci Aşama */}
      <h2 className="font-semibold mt-4">İkinci Aşama</h2>
      {inProgressTasks.map(t => (
        <TaskCard
          key={t.id}
          task={t}
          buttons={
            <>
              <button className="bg-green-500 text-white px-2 rounded" onClick={() => updateTask(t.id, "tamamlandı")}>Tamamlandı</button>
              <button className="bg-gray-300 px-2 rounded" onClick={() => updateTask(t.id, "onay_bekliyor")}>Geri Al</button>
              <button className="bg-red-500 text-white px-2 rounded" onClick={() => deleteTask(t.id)}>Sil</button>
            </>
          }
        />
      ))}

      {/* Tamamlanan */}
      <h2 className="font-semibold mt-4">Tamamlanan</h2>
      {completedTasks.map(t => (
        <TaskCard
          key={t.id}
          task={t}
          buttons={
            <>
              <button className="bg-gray-300 px-2 rounded" onClick={() => updateTask(t.id, "devam")}>Geri Al</button>
              <button className="bg-red-500 text-white px-2 rounded" onClick={() => deleteTask(t.id)}>Sil</button>
            </>
          }
        />
      ))}
    </div>
  );
}

export default App;
