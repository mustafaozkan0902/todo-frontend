import { useEffect, useState } from "react";
import axios from "axios";

// Buraya ekliyoruz:
const API_URL = "https://todo-flask-duf3.onrender.com/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get(API_URL); // burası artık değişken
    setTasks(res.data);
  };

  const addTask = async () => {
    await axios.post(API_URL, { title }); // burası da değişken
    setTitle("");
    fetchTasks();
  };

  const updateTask = async (id, status) => {
    await axios.put(`${API_URL}/${id}`, { status }); // burası da değişken
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
