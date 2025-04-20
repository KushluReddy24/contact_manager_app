// client/src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const api = axios.create({ baseURL: "http://localhost:5000" });

const ContactForm = ({ contact, onSubmit }) => {
  const [form, setForm] = useState(contact || { name: "", email: "", phone: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-3">
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="input" required />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="input" />
      <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="input" required />
      <button type="submit" className="btn">Submit</button>
    </form>
  );
};

const ContactList = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    api.get("/contacts").then((res) => setContacts(res.data));
  }, []);

  const deleteContact = async (id) => {
    await api.delete(`/contacts/${id}`);
    setContacts(contacts.filter((c) => c.id !== id));
  };

  return (
    <div className="p-4">
      <Link to="/add" className="btn mb-4">Add Contact</Link>
      <ul className="space-y-2">
        {contacts.map((c) => (
          <li key={c.id} className="p-3 bg-gray-100 rounded">
            <div>{c.name} - {c.email} - {c.phone}</div>
            <Link to={`/edit/${c.id}`} className="btn mr-2">Edit</Link>
            <button onClick={() => deleteContact(c.id)} className="btn-red">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const AddContact = ({ navigate }) => {
  const handleAdd = async (data) => {
    await api.post("/contacts", data);
    navigate("/");
  };
  return <ContactForm onSubmit={handleAdd} />;
};

const EditContact = ({ id, navigate }) => {
  const [contact, setContact] = useState(null);

  useEffect(() => {
    api.get(`/contacts/${id}`).then((res) => setContact(res.data));
  }, [id]);

  const handleUpdate = async (data) => {
    await api.put(`/contacts/${id}`, data);
    navigate("/");
  };

  return contact ? <ContactForm contact={contact} onSubmit={handleUpdate} /> : <div>Loading...</div>;
};

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<ContactList />} />
      <Route path="/add" element={<AddContact navigate={useNavigate()} />} />
      <Route path="/edit/:id" element={<RouteRenderer />} />
    </Routes>
  </Router>
);

const RouteRenderer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  return <EditContact id={id} navigate={navigate} />;
};

export default App;

// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};

// client/src/index.css
@tailwind base;
@tailwind components;
@tailwind utilities;

.input {
  @apply border p-2 w-full rounded;
}
.btn {
  @apply bg-blue-500 text-white px-4 py-2 rounded;
}
.btn-red {
  @apply bg-red-500 text-white px-4 py-2 rounded;
}
