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
    } catch (err) {
      console.error(err);
    }
  };

  const addTask = async () => {
    if (!title) return;
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

  // Tamamlanan ve tamamlanmayanları ayır
  const incompleteTasks = tasks.filter(t => t.status !== "tamamlandı");
  const completeTasks = tasks.filter(t => t.status === "tamamlandı");

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>Yapılacaklar Listesi</h1>

      <div style={{ marginBottom: "10px" }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Yeni görev"
        />
        <button onClick={addTask}>Ekle</button>
      </div>

      <h2>Görevler</h2>
      <ul>
        {incompleteTasks.map((t) => (
          <li key={t.id} style={{ marginBottom: "5px" }}>
            {t.title} - {t.status}
            <button onClick={() => updateTask(t.id, "onay_bekliyor")}>Onay Bekleyen</button>
            <button onClick={() => updateTask(t.id, "tamamlandı")}>Tamamlandı</button>
            <button onClick={() => deleteTask(t.id)}>Sil</button>
          </li>
        ))}
      </ul>

      {completeTasks.length > 0 && (
        <>
          <h2>Tamamlananlar</h2>
          <ul>
            {completeTasks.map((t) => (
              <li key={t.id} style={{ marginBottom: "5px" }}>
                {t.title} - {t.status}
                <button onClick={() => updateTask(t.id, "onay_bekliyor")}>Geri Al</button>
                <button onClick={() => deleteTask(t.id)}>Sil</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
