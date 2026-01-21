// src/components/Header.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * Encabezado principal de la aplicación AGROFARM.
 */
function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-text">
        <h1>AGROFARM - Sistema de Gestión Porcícola</h1>
        <p className="header-subtitle">
          Módulo frontend en React – Gestión de cerdos
        </p>
      </div>

      <button className="btn-logout" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </header>
  );
}

export default Header;
