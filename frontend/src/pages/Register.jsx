// src/pages/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    if (!username || !password) {
      setError("Usuario y contraseña son obligatorios.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "No se pudo registrar el usuario.");
        return;
      }

      setMsg("Usuario registrado correctamente. Ahora puedes iniciar sesión.");
      setUsername("");
      setPassword("");

      // Pequeña pausa para que veas el mensaje
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      setError("Error de conexión con la API (¿está corriendo en el puerto 3001?).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Register</h1>

      <form onSubmit={handleRegister} style={{ maxWidth: 320 }}>
        <div style={{ marginBottom: 10 }}>
          <input
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <input
            placeholder="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        {error && <p style={{ color: "#f97316" }}>{error}</p>}
        {msg && <p style={{ color: "#22c55e" }}>{msg}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrar"}
        </button>
      </form>

      <p style={{ marginTop: 12 }}>
        <Link to="/login">Volver a Login</Link>
      </p>
    </div>
  );
}
