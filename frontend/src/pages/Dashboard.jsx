// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import Header from "../components/Header";
import PigForm from "../components/PigForm";
import PigList from "../components/PigList";

export default function Dashboard() {
  const [pigs, setPigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Cargar cerdos desde la API
  const loadPigs = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const res = await fetch("https://api-agrofarm.onrender.com/api/pigs", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }
        throw new Error("Error al cargar los cerdos");
      }

      const data = await res.json();
      setPigs(data);
    } catch (err) {
      setError(err.message || "Error al conectar con la API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPigs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Agrega un nuevo cerdo a la lista
  const handleAddPig = async (nuevoCerdo) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://api-agrofarm.onrender.com/api/pigs", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoCerdo),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al crear el cerdo");
      }

      // Recargar la lista
      await loadPigs();
    } catch (err) {
      alert(err.message);
    }
  };

  // Cambia el estado del cerdo
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const newStatus = currentStatus === "ACTIVO" ? "INACTIVO" : "ACTIVO";
      
      const res = await fetch(`https://api-agrofarm.onrender.com/api/pigs/${id}/status`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Error al actualizar el estado");
      }

      // Recargar la lista
      await loadPigs();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="app-container">
      <Header />
      <main className="content">
        <section className="panel">
          <h2>Registro de cerdos</h2>
          <PigForm onAddPig={handleAddPig} />
        </section>

        <section className="panel">
          <h2>Listado de cerdos</h2>
          {loading && <p>Cargando...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {!loading && !error && (
            <PigList pigs={pigs} onToggleStatus={handleToggleStatus} />
          )}
        </section>
      </main>
    </div>
  );
}
