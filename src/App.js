// src/App.js
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://todo-flask-duf3.onrender.com/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (error) {
      console.error("Görevler alınamadı:", error);
    }
  };

  const addTask = async () => {
    if (!title) return;
    await axios.post(API_URL, { title, status: "onay_bekliyor" });
    setTitle("");
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

  return (
    <div className="p-8 font-sans bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Yapılacaklar Listesi</h1>

      <div className="flex mb-6">
        <input
          className="flex-1 p-2 border rounded-l"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Yeni görev"
        />
        <button 
          className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600"
          onClick={addTask}
        >
          Ekle
        </button>
      </div>

      {/* Görev Bölümleri */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Onay Bekleyen */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Onay Bekleyen</h2>
          {pendingTasks.length === 0 && <p className="text-gray-400">Görev yok</p>}
          <ul>
            {pendingTasks.map(t => (
              <li key={t.id} className="mb-2 flex justify-between items-center">
                <span>{t.title}</span>
                <div className="flex gap-1">
                  <button 
                    className="bg-yellow-400 px-2 rounded text-sm hover:bg-yellow-500"
                    onClick={() => updateTask(t.id, "devam")}
                  >
                    İkinci Aşama
                  </button>
                  <button 
                    className="bg-green-500 px-2 rounded text-sm text-white hover:bg-green-600"
                    onClick={() => updateTask(t.id, "tamamlandı")}
                  >
                    Tamamlandı
                  </button>
                  <button 
                    className="bg-red-500 px-2 rounded text-sm text-white hover:bg-red-600"
                    onClick={() => deleteTask(t.id)}
                  >
                    Sil
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* İkinci Aşama / Devam Eden */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">İkinci Aşama</h2>
          {inProgressTasks.length === 0 && <p className="text-gray-400">Görev yok</p>}
          <ul>
            {inProgressTasks.map(t => (
              <li key={t.id} className="mb-2 flex justify-between items-center">
                <span>{t.title}</span>
                <div className="flex gap-1">
                  <button 
                    className="bg-green-500 px-2 rounded text-sm text-white hover:bg-green-600"
                    onClick={() => updateTask(t.id, "tamamlandı")}
                  >
                    Tamamlandı
                  </button>
                  <button 
                    className="bg-gray-300 px-2 rounded text-sm hover:bg-gray-400"
                    onClick={() => updateTask(t.id, "onay_bekliyor")}
                  >
                    Geri Al
                  </button>
                  <button 
                    className="bg-red-500 px-2 rounded text-sm text-white hover:bg-red-600"
                    onClick={() => deleteTask(t.id)}
                  >
                    Sil
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Tamamlanan */}
        <div className="bg-green-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Tamamlanan</h2>
          {completedTasks.length === 0 && <p className="text-gray-400">Görev yok</p>}
          <ul>
            {completedTasks.map(t => (
              <li key={t.id} className="mb-2 flex justify-between items-center">
                <span className="line-through text-green-700">{t.title}</span>
                <div className="flex gap-1">
                  <button 
                    className="bg-gray-300 px-2 rounded text-sm hover:bg-gray-400"
                    onClick={() => updateTask(t.id, "devam")}
                  >
                    Geri Al
                  </button>
                  <button 
                    className="bg-red-500 px-2 rounded text-sm text-white hover:bg-red-600"
                    onClick={() => deleteTask(t.id)}
                  >
                    Sil
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
