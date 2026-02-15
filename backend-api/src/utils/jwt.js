import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "agrofarm_default_secret_change_me";
const JWT_EXPIRES_IN = "24h";

/**
 * Genera un token JWT con los datos del usuario
 * @param {{ id: number, username: string, role: string }} payload
 * @returns {string} Token JWT firmado
 */
export function generateToken(payload) {
    return jwt.sign(
        { userId: payload.id, username: payload.username, role: payload.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
}

/**
 * Verifica y decodifica un token JWT
 * @param {string} token
 * @returns {{ userId: number, username: string, role: string }}
 */
export function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}
