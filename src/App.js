import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get("https://todo-flask-duf3.onrender.com/api/tasks");
    setTasks(res.data);
  };

  const addTask = async () => {
    await axios.post("https://todo-flask-duf3.onrender.com/api/tasks", { title });
    setTitle("");
    fetchTasks();
  };

  const updateTask = async (id, status) => {
    await axios.put(`https://todo-flask-duf3.onrender.com/api/tasks/${id}`, { status });
    fetchTasks();
  };

  return (
    <div>
      <h1>Yapılacaklar Listesi</h1>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Yeni görev"/>
      <button onClick={addTask}>Ekle</button>
      <ul>
        {tasks.map(t => (
          <li key={t.id}>
            {t.title} - {t.status} 
            <button onClick={() => updateTask(t.id, "onay")}>Onay Bekleyen</button>
            <button onClick={() => updateTask(t.id, "tamamlandı")}>Tamamlandı</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
