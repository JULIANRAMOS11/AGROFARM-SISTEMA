import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Sanidad from "./pages/Sanidad";
import Reproduccion from "./pages/Reproduccion";
import Produccion from "./pages/Produccion";
import Nutricion from "./pages/Nutricion";
import Perfil from "./pages/Perfil";
import PrivateRoute from "./routes/PrivateRoute";

import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas con layout de Dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          {/* index = /dashboard (Resumen + Cerdos) */}
          {/* Rutas anidadas renderizadas via <Outlet /> en Dashboard */}
          <Route path="sanidad" element={<Sanidad />} />
          <Route path="reproduccion" element={<Reproduccion />} />
          <Route path="produccion" element={<Produccion />} />
          <Route path="nutricion" element={<Nutricion />} />
          <Route path="perfil" element={<Perfil />} />
          {/* Catch-all — prevents blank screen on unknown paths */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Global catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
