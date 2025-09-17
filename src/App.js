import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://todo-flask-duf3.onrender.com/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (err) {
      console.error("Görevler alınamadı:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 5000);
    return () => clearInterval(interval);
  }, []);

  const addTask = async () => {
    if (!title.trim()) return;
    await axios.post(API_URL, { title });
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
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>Yapılacaklar Listesi</h1>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Yeni görev"
          style={{ flex: 1 }}
        />
        <button onClick={addTask}>Ekle</button>
      </div>

      <h2>Onay Bekleyen Görevler</h2>
      <ul>
        {pendingTasks.map(t => (
          <li key={t.id} style={{ marginBottom: 5 }}>
            {t.title} - {t.status}{" "}
            <button onClick={() => updateTask(t.id, "devam")}>Onaya Geçir</button>{" "}
            <button onClick={() => deleteTask(t.id)}>Sil</button>
          </li>
        ))}
      </ul>

      <h2>Devam Eden Görevler</h2>
      <ul>
        {inProgressTasks.map(t => (
          <li key={t.id} style={{ marginBottom: 5 }}>
            {t.title} - {t.status}{" "}
            <button onClick={() => updateTask(t.id, "tamamlandı")}>Tamamla</button>{" "}
            <button onClick={() => updateTask(t.id, "onay_bekliyor")}>Geri Al</button>{" "}
            <button onClick={() => deleteTask(t.id)}>Sil</button>
          </li>
        ))}
      </ul>

      <h2>Tamamlanan Görevler</h2>
      <ul>
        {completedTasks.map(t => (
          <li key={t.id} style={{ marginBottom: 5 }}>
            {t.title} - {t.status}{" "}
            <button onClick={() => updateTask(t.id, "devam")}>Geri Al</button>{" "}
            <button onClick={() => deleteTask(t.id)}>Sil</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
