import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { apiGet, apiPut, apiPost, getUser } from "../services/api";

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formData, setFormData] = useState({ nombre_completo: "", email: "", telefono: "", cargo: "" });
  const [passwordData, setPasswordData] = useState({ current_password: "", new_password: "", confirm_password: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { const data = await apiGet("/auth/profile"); setUser(data); setFormData({ nombre_completo: data.nombre_completo || "", email: data.email || "", telefono: data.telefono || "", cargo: data.cargo || "" }); }
      catch { const local = getUser(); if (local) { setUser(local); setFormData({ nombre_completo: local.nombre_completo || "", email: local.email || "", telefono: local.telefono || "", cargo: local.cargo || "" }); } }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try { const updated = await apiPut("/auth/profile", formData); setUser(updated); setIsEditing(false); toast.success("Perfil actualizado"); }
    catch (err) { toast.error(err.message || "Error al actualizar"); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) { toast.error("Las contraseñas no coinciden"); return; }
    try { await apiPost("/auth/change-password", { current_password: passwordData.current_password, new_password: passwordData.new_password }); toast.success("Contraseña actualizada"); setShowPasswordForm(false); setPasswordData({ current_password: "", new_password: "", confirm_password: "" }); }
    catch (err) { toast.error(err.message || "Error al cambiar contraseña"); }
  };

  const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all";

  if (loading) return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="h-44 bg-white rounded-2xl border border-gray-100 animate-pulse"></div>
      <div className="h-60 bg-white rounded-2xl border border-gray-100 animate-pulse"></div>
    </div>
  );

  const userName = user?.nombre_completo || user?.username || "Usuario";
  const initials = userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <i className="fas fa-user-circle text-white"></i>
            </div>Mi Perfil
          </h1>
          <p className="text-gray-500 mt-1">Información personal y seguridad</p>
        </div>
        <button onClick={() => setIsEditing(!isEditing)}
          className={isEditing
            ? "px-5 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all"
            : "inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:scale-105 transition-all duration-300"
          }>
          <i className={`fas ${isEditing ? "fa-times" : "fa-pen"}`}></i>
          {isEditing ? "Cancelar" : "Editar Perfil"}
        </button>
      </div>

      {/* ── Profile Card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>
        <div className="px-8 pb-8 -mt-12 relative z-10">
          <div className="flex items-end gap-5">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl border-4 border-white">
              {initials}
            </div>
            <div className="pb-2">
              <h3 className="text-xl font-extrabold text-slate-800">{userName}</h3>
              <p className="text-sm text-gray-400">@{user?.username || "user"} · {user?.cargo || "Sin cargo"}</p>
            </div>
          </div>
        </div>

        {isEditing && (
          <form onSubmit={handleUpdateProfile} className="px-8 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-5 border-t border-gray-100">
              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Nombre Completo</label><input type="text" value={formData.nombre_completo} onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })} className={inputClass} /></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} /></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Teléfono</label><input type="tel" value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} className={inputClass} /></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Cargo</label><input type="text" value={formData.cargo} onChange={(e) => setFormData({ ...formData, cargo: e.target.value })} className={inputClass} /></div>
            </div>
            <div className="flex gap-3 mt-5 pt-4 border-t border-gray-100">
              <button type="submit" className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:scale-105 transition-all duration-300"><i className="fas fa-save"></i>Guardar</button>
              <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all">Cancelar</button>
            </div>
          </form>
        )}
      </div>

      {/* ── Info ── */}
      {!isEditing && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-8">
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 pb-4 mb-5 border-b border-gray-100">
            <i className="fas fa-info-circle text-emerald-500"></i>Información Personal
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[{ l: "Nombre", v: user?.nombre_completo, i: "fa-user" }, { l: "Email", v: user?.email, i: "fa-envelope" }, { l: "Teléfono", v: user?.telefono, i: "fa-phone" }, { l: "Cargo", v: user?.cargo, i: "fa-briefcase" }].map(f => (
              <div key={f.l} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center"><i className={`fas ${f.i} text-gray-400 text-xs`}></i></div>
                <div><p className="text-xs text-gray-400 mb-0.5">{f.l}</p><p className="text-sm font-semibold text-slate-700">{f.v || "No definido"}</p></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Security ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-8">
        <div className="flex justify-between items-center pb-4 mb-5 border-b border-gray-100">
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2"><i className="fas fa-shield-halved text-emerald-500"></i>Seguridad</h4>
          <button onClick={() => setShowPasswordForm(!showPasswordForm)} className={showPasswordForm ? "px-4 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-semibold rounded-xl hover:bg-gray-50 transition-all" : "inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-500/20 hover:shadow-lg hover:scale-105 transition-all duration-300"}>
            <i className={`fas ${showPasswordForm ? "fa-times" : "fa-key"}`}></i>{showPasswordForm ? "Cerrar" : "Cambiar Contraseña"}
          </button>
        </div>
        {showPasswordForm ? (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Contraseña actual</label><input type="password" value={passwordData.current_password} onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })} className={inputClass} required /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Nueva contraseña</label><input type="password" value={passwordData.new_password} onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })} className={inputClass} required minLength="6" /></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirmar nueva</label><input type="password" value={passwordData.confirm_password} onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })} className={inputClass} required minLength="6" /></div>
            </div>
            <button type="submit" className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:scale-105 transition-all duration-300"><i className="fas fa-save"></i>Actualizar Contraseña</button>
          </form>
        ) : (
          <div className="flex items-center gap-3 p-5 bg-green-50 rounded-xl border border-green-200">
            <i className="fas fa-lock text-green-500 text-lg"></i>
            <p className="text-sm text-gray-600">Tu contraseña está protegida. Puedes cambiarla en cualquier momento.</p>
          </div>
        )}
      </div>
    </div>
  );
}
