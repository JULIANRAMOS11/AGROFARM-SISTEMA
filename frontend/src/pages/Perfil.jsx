import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { apiGet, apiPut, apiPost, getUser } from "../services/api";

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre_completo: "", email: "", telefono: "", cargo: ""
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
          cargo: data.cargo || ""
        });
      } catch (err) {
        const localUser = getUser();
        if (localUser) {
          setUser(localUser);
          setFormData({
            nombre_completo: localUser.nombre_completo || "",
            email: localUser.email || "",
            telefono: localUser.telefono || "",
            cargo: localUser.cargo || ""
          });
        }
      } finally { setLoading(false); }
    };
    loadProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const updated = await apiPut("/auth/profile", formData);
      setUser(updated);
      setIsEditing(false);
      toast.success("Perfil actualizado");
    } catch (err) { toast.error(err.message || "Error al actualizar"); }
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
    } catch (err) { toast.error(err.message || "Error al cambiar contraseña"); }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="skeleton w-full h-40 rounded-2xl"></div>
        <div className="skeleton w-full h-60 rounded-2xl"></div>
      </div>
    );
  }

  const userName = user?.nombre_completo || user?.username || "Usuario";
  const initials = userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="max-w-3xl mx-auto">

      {/* ── Page Header ── */}
      <div className="page-header">
        <div>
          <h2><i className="fas fa-user-circle"></i>Mi Perfil</h2>
          <p className="subtitle">Información personal y seguridad</p>
        </div>
        <button onClick={() => setIsEditing(!isEditing)} className={isEditing ? "btn-secondary" : "btn-primary"}>
          <i className={`fas ${isEditing ? "fa-times" : "fa-pen"}`}></i>
          {isEditing ? "Cancelar" : "Editar Perfil"}
        </button>
      </div>

      {/* ── Profile Card ── */}
      <div className="table-container overflow-hidden mb-5">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 relative">
          <div className="absolute inset-0 bg-black/5"></div>
        </div>

        {/* Avatar + Info */}
        <div className="px-6 pb-6 -mt-10 relative z-10">
          <div className="flex items-end gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-white">
              {initials}
            </div>
            <div className="pb-1">
              <h3 className="text-xl font-bold text-gray-900">{userName}</h3>
              <p className="text-sm text-gray-400">@{user?.username || "user"}</p>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleUpdateProfile} className="px-6 pb-6">
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
            <div className="flex gap-3 mt-5 pt-4 border-t border-gray-100">
              <button type="submit" className="btn-primary"><i className="fas fa-save"></i>Guardar Cambios</button>
              <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">Cancelar</button>
            </div>
          </form>
        )}
      </div>

      {/* ── Personal Info (view mode) ── */}
      {!isEditing && (
        <div className="table-container p-6 mb-5">
          <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b border-gray-100">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <i className="fas fa-info-circle text-white text-xs"></i>
            </div>
            Información Personal
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { label: "Nombre Completo", value: user?.nombre_completo, icon: "fa-user" },
              { label: "Email", value: user?.email, icon: "fa-envelope" },
              { label: "Teléfono", value: user?.telefono, icon: "fa-phone" },
              { label: "Cargo", value: user?.cargo, icon: "fa-briefcase" },
            ].map(field => (
              <div key={field.label} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center mt-0.5">
                  <i className={`fas ${field.icon} text-gray-400 text-xs`}></i>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">{field.label}</p>
                  <p className="text-sm font-medium text-gray-800">{field.value || "No definido"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Security ── */}
      <div className="table-container p-6">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
          <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <i className="fas fa-shield-halved text-white text-xs"></i>
            </div>
            Seguridad
          </h4>
          <button onClick={() => setShowPasswordForm(!showPasswordForm)} className={showPasswordForm ? "btn-secondary" : "btn-primary"} style={{ fontSize: '0.78rem', padding: '0.4rem 0.85rem' }}>
            <i className={`fas ${showPasswordForm ? "fa-times" : "fa-key"}`}></i>
            {showPasswordForm ? "Cerrar" : "Cambiar Contraseña"}
          </button>
        </div>

        {showPasswordForm ? (
          <form onSubmit={handleChangePassword} className="space-y-4">
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
        ) : (
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
            <i className="fas fa-lock text-green-500"></i>
            <p className="text-sm text-gray-600">Tu contraseña está protegida. Puedes cambiarla en cualquier momento.</p>
          </div>
        )}
      </div>
    </div>
  );
}
