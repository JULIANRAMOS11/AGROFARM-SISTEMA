import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { apiGet, apiPut, apiPost } from "../services/api";
import { getUser } from "../services/api";

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre_completo: "",
    email: "",
    telefono: "",
    cargo: "",
    avatar_url: ""
  });
  const [passwordData, setPasswordData] = useState({
    password_actual: "",
    password_nueva: "",
    password_confirmar: ""
  });

  useEffect(() => {
    const userData = getUser();
    if (userData?.username) {
      fetchPerfil(userData.username);
    }
  }, []);

  const fetchPerfil = async (username) => {
    try {
      const data = await apiGet(`/perfil?username=${username}`);
      setUser(data);
      setFormData({
        nombre_completo: data.nombre_completo || "",
        email: data.email || "",
        telefono: data.telefono || "",
        cargo: data.cargo || "",
        avatar_url: data.avatar_url || ""
      });
    } catch (error) {
      console.error("Error al cargar perfil:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await apiPut(`/perfil/${user.id}`, formData);
      setUser(updatedUser);
      setIsEditing(false);
      toast.success("Perfil actualizado exitosamente");
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      toast.error(error.message || "Error al actualizar perfil");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.password_nueva !== passwordData.password_confirmar) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    try {
      await apiPost(`/perfil/${user.id}/password`, {
        password_actual: passwordData.password_actual,
        password_nueva: passwordData.password_nueva
      });
      toast.success("Contraseña actualizada exitosamente");
      setShowPasswordForm(false);
      setPasswordData({
        password_actual: "",
        password_nueva: "",
        password_confirmar: ""
      });
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      toast.error(error.message || "Error al cambiar contraseña");
    }
  };

  if (!user) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">Cargando perfil...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          <i className="fas fa-user-circle mr-2"></i>Mi Perfil
        </h2>

        {/* Card de Perfil */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-5xl">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <i className="fas fa-user"></i>
                )}
              </div>
            </div>

            {/* Información */}
            <div className="flex-grow">
              {!isEditing ? (
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {user.nombre_completo || user.username}
                      </h3>
                      <p className="text-gray-600">@{user.username}</p>
                      <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                        {user.role}
                      </span>
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      <i className="fas fa-edit mr-2"></i>Editar
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-semibold">{user.email || "No especificado"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Teléfono</p>
                      <p className="font-semibold">{user.telefono || "No especificado"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Cargo</p>
                      <p className="font-semibold">{user.cargo || "No especificado"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Miembro desde</p>
                      <p className="font-semibold">{new Date(user.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Nombre Completo</label>
                      <input
                        type="text"
                        value={formData.nombre_completo}
                        onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Teléfono</label>
                      <input
                        type="tel"
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Cargo</label>
                      <input
                        type="text"
                        value={formData.cargo}
                        onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold mb-1">Avatar URL</label>
                      <input
                        type="url"
                        value={formData.avatar_url}
                        onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg">
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-300 px-6 py-2 rounded-lg"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Cambiar Contraseña */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              <i className="fas fa-key mr-2"></i>Seguridad
            </h3>
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
            >
              <i className="fas fa-lock mr-2"></i>Cambiar Contraseña
            </button>
          </div>

          {showPasswordForm && (
            <form onSubmit={handlePasswordSubmit} className="mt-4 border-t pt-4">
              <div className="grid grid-cols-1 gap-4 max-w-md">
                <div>
                  <label className="block text-sm font-semibold mb-1">Contraseña Actual</label>
                  <input
                    type="password"
                    value={passwordData.password_actual}
                    onChange={(e) => setPasswordData({ ...passwordData, password_actual: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Nueva Contraseña</label>
                  <input
                    type="password"
                    value={passwordData.password_nueva}
                    onChange={(e) => setPasswordData({ ...passwordData, password_nueva: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                    minLength="6"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Confirmar Nueva Contraseña</label>
                  <input
                    type="password"
                    value={passwordData.password_confirmar}
                    onChange={(e) => setPasswordData({ ...passwordData, password_confirmar: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                    minLength="6"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg">
                  Actualizar Contraseña
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({
                      password_actual: "",
                      password_nueva: "",
                      password_confirmar: ""
                    });
                  }}
                  className="bg-gray-300 px-6 py-2 rounded-lg"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
