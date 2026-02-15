import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { apiGet, apiPut, apiPost } from "../services/api";
import { getUser } from "../services/api";

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre_completo: "", email: "", telefono: "", cargo: "", avatar_url: ""
  });
  const [passwordData, setPasswordData] = useState({
    current_password: "", new_password: "", confirm_password: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await apiGet("/auth/profile");
        setUser(data);
        setFormData({
          nombre_completo: data.nombre_completo || "",
          email: data.email || "",
          telefono: data.telefono || "",
          cargo: data.cargo || "",
          avatar_url: data.avatar_url || ""
        });
      } catch (error) {
        const localUser = getUser();
        if (localUser) {
          setUser(localUser);
          setFormData({
            nombre_completo: localUser.nombre_completo || "",
            email: localUser.email || "",
            telefono: localUser.telefono || "",
            cargo: localUser.cargo || "",
            avatar_url: localUser.avatar_url || ""
          });
        }
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const updated = await apiPut("/auth/profile", formData);
      setUser(updated);
      setIsEditing(false);
      toast.success("Perfil actualizado exitosamente");
    } catch (error) {
      toast.error(error.message || "Error al actualizar");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    try {
      await apiPost("/auth/change-password", {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      toast.success("Contraseña actualizada");
      setShowPasswordForm(false);
      setPasswordData({ current_password: "", new_password: "", confirm_password: "" });
    } catch (error) {
      toast.error(error.message || "Error al cambiar contraseña");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton w-full h-40 rounded-2xl"></div>
        <div className="skeleton w-full h-60 rounded-2xl"></div>
      </div>
    );
  }

  const userName = user?.nombre_completo || user?.username || "Usuario";
  const initials = userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="max-w-3xl mx-auto space-y-5 animate-fadeIn">

      {/* Card de Perfil */}
      <div className="glass-card overflow-hidden">
        {/* Banner */}
        <div className="h-28 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-6 right-6">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-white/20 backdrop-blur-md text-white text-xs font-semibold rounded-lg border border-white/30 hover:bg-white/30 transition-all"
            >
              <i className={`fas ${isEditing ? 'fa-times' : 'fa-pen'} mr-1.5`}></i>
              {isEditing ? "Cancelar" : "Editar Perfil"}
            </button>
          </div>
        </div>

        {/* Avatar + Info */}
        <div className="px-6 pb-6 -mt-12 relative z-10">
          <div className="flex items-end gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-white transition-transform hover:scale-105">
              {initials}
            </div>
            <div className="pb-1">
              <h3 className="text-xl font-bold text-gray-900">{userName}</h3>
              <p className="text-sm text-gray-400">@{user?.username || "user"}</p>
            </div>
          </div>
        </div>

        {/* Formulario de Edición */}
        {isEditing && (
          <form onSubmit={handleUpdateProfile} className="px-6 pb-6 animate-slideUp">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div>
                <label className="form-label">Nombre Completo</label>
                <input type="text" value={formData.nombre_completo} onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })} className="input-modern" placeholder="Tu nombre completo" />
              </div>
              <div>
                <label className="form-label">Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-modern" placeholder="correo@ejemplo.com" />
              </div>
              <div>
                <label className="form-label">Teléfono</label>
                <input type="tel" value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} className="input-modern" placeholder="+57 300 000 0000" />
              </div>
              <div>
                <label className="form-label">Cargo</label>
                <input type="text" value={formData.cargo} onChange={(e) => setFormData({ ...formData, cargo: e.target.value })} className="input-modern" placeholder="Administrador" />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button type="submit" className="btn-primary"><i className="fas fa-save"></i>Guardar Cambios</button>
              <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">Cancelar</button>
            </div>
          </form>
        )}
      </div>

      {/* Información del perfil (modo vista) */}
      {!isEditing && (
        <div className="glass-card p-6 animate-slideUp delay-100">
          <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i className="fas fa-info-circle text-green-500"></i>Información Personal
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Nombre Completo</p>
              <p className="text-sm font-medium text-gray-800">{user?.nombre_completo || "No definido"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Email</p>
              <p className="text-sm font-medium text-gray-800">{user?.email || "No definido"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Teléfono</p>
              <p className="text-sm font-medium text-gray-800">{user?.telefono || "No definido"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Cargo</p>
              <p className="text-sm font-medium text-gray-800">{user?.cargo || "No definido"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Seguridad */}
      <div className="glass-card p-6 animate-slideUp delay-200">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <i className="fas fa-shield-halved text-green-500"></i>Seguridad
          </h4>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="btn-primary !py-1.5 !px-3 !text-xs"
          >
            <i className={`fas ${showPasswordForm ? 'fa-times' : 'fa-key'}`}></i>
            {showPasswordForm ? "Cerrar" : "Cambiar Contraseña"}
          </button>
        </div>

        {showPasswordForm && (
          <form onSubmit={handleChangePassword} className="space-y-4 animate-scaleIn">
            <div>
              <label className="form-label">Contraseña actual</label>
              <input type="password" value={passwordData.current_password} onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })} className="input-modern" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Nueva contraseña</label>
                <input type="password" value={passwordData.new_password} onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })} className="input-modern" required minLength="6" />
              </div>
              <div>
                <label className="form-label">Confirmar nueva</label>
                <input type="password" value={passwordData.confirm_password} onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })} className="input-modern" required minLength="6" />
              </div>
            </div>
            <button type="submit" className="btn-primary"><i className="fas fa-save"></i>Actualizar Contraseña</button>
          </form>
        )}

        {!showPasswordForm && (
          <p className="text-sm text-gray-400">Tu contraseña está protegida. Puedes cambiarla en cualquier momento.</p>
        )}
      </div>
    </div>
  );
}
