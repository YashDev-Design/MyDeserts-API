import React, { useState, useEffect } from "react";
import api from "./api";

function App() {
  const [deserts, setDeserts] = useState([]);
  const [form, setForm] = useState({ name: "", type: "", calories: "" });
  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    const res = await api.get("/deserts");
    setDeserts(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await api.put(`/deserts/${editId}`, form);
      setEditId(null);
    } else {
      await api.post("/deserts", form);
    }
    setForm({ name: "", type: "", calories: "" });
    fetchData();
  };

  const handleDelete = async (id) => {
    await api.delete(`/deserts/${id}`);
    fetchData();
  };

  const handleEdit = (d) => {
    setForm(d);
    setEditId(d._id);
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: 20 }}>
      <h2>🍰 MyDeserts App</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Dessert Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <br />
        <br />
        <input
          placeholder="Type"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        />
        <br />
        <br />
        <input
          placeholder="Calories"
          value={form.calories}
          onChange={(e) => setForm({ ...form, calories: e.target.value })}
        />
        <br />
        <br />

        <button type="submit">
          {editId ? "✅ Update Dessert" : "➕ Add Dessert"}
        </button>
      </form>

      <hr />

      <h3>📋 Dessert List</h3>
      {deserts.map((d) => (
        <div key={d._id}>
          {d.name} | {d.type} | {d.calories} cal
          <button onClick={() => handleEdit(d)}>✏ Edit</button>
          <button onClick={() => handleDelete(d._id)}>🗑 Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;
