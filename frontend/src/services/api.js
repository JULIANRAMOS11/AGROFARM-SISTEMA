/**
 * Servicio API Centralizado - AGROFARM
 * Maneja todas las peticiones HTTP con autenticación JWT automática
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://api-agrofarm.onrender.com/api";

// ── Helpers de Token ──────────────────────────────────────────────

export function getAuthToken() {
    return localStorage.getItem("token");
}

export function setAuthToken(token) {
    localStorage.setItem("token", token);
}

export function getUser() {
    try {
        const userStr = localStorage.getItem("user");
        return userStr ? JSON.parse(userStr) : null;
    } catch {
        return null;
    }
}

export function clearAuth() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}

// ── Función base de fetch ─────────────────────────────────────────

async function request(path, options = {}) {
    const token = getAuthToken();
    const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const res = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
        credentials: "include",
    });

    // Si el token expiró o es inválido, redirigir al login
    if (res.status === 401) {
        clearAuth();
        window.location.href = "/login";
        throw new Error("Sesión expirada. Redirigiendo al login...");
    }

    return res;
}

// ── Métodos HTTP ──────────────────────────────────────────────────

export async function apiGet(path) {
    const res = await request(path);
    return res.json();
}

export async function apiPost(path, body) {
    const res = await request(path, {
        method: "POST",
        body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error en la petición");
    return data;
}

export async function apiPut(path, body) {
    const res = await request(path, {
        method: "PUT",
        body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error en la petición");
    return data;
}

export async function apiPatch(path, body) {
    const res = await request(path, {
        method: "PATCH",
        body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error en la petición");
    return data;
}

export async function apiDelete(path) {
    const res = await request(path, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error en la petición");
    return data;
}

// ── Auth helpers (login / register) ───────────────────────────────

export async function login(credentials) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al iniciar sesión");

    // Guardar token JWT y datos del usuario
    setAuthToken(data.token);
    localStorage.setItem("user", JSON.stringify(data.usuario));

    return data;
}

export async function register(credentials) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al registrarse");

    setAuthToken(data.token);
    localStorage.setItem("user", JSON.stringify(data.usuario));

    return data;
}
