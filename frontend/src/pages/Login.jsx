import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (email.trim() === "" || password.trim() === "") {
      setError("Debe ingresar email y contraseña.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Error al iniciar sesión.");
        return;
      }

      localStorage.setItem("token", "api-login-ok");
      localStorage.setItem("user", JSON.stringify(data.usuario));

      nav("/dashboard");
    } catch (e2) {
      setError("No se pudo conectar con la API (¿está corriendo en puerto 4000?).");
    } finally {
      setLoading(false);
    }
  };

  const disabled = loading || email.trim() === "" || password.trim() === "";

  return (
    <div style={{ padding: 24 }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={{ marginTop: 8 }}>
          <input
            placeholder="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p style={{ marginTop: 10, color: "#f97316", fontSize: 14 }}>
            {error}
          </p>
        )}

        <button style={{ marginTop: 12 }} type="submit" disabled={disabled}>
          {loading ? "Ingresando..." : "Entrar"}
        </button>
      </form>

      <p style={{ marginTop: 12 }}>
        ¿No tienes cuenta? <Link to="/register">Registrarse</Link>
      </p>
    </div>
  );
}
