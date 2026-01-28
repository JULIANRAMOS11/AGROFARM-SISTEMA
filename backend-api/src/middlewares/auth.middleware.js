/**
 * Middleware de Autenticación
 * Valida que el usuario tenga un token válido
 */

export const validateAuth = (req, res, next) => {
  try {
    // Por ahora solo validamos que exista un token
    // En producción deberías usar JWT
    const token = req.headers.authorization;
    
    if (!token || token !== 'Bearer api-login-ok') {
      return res.status(401).json({ 
        error: 'No autorizado. Token inválido o ausente.' 
      });
    }
    
    next();
  } catch (error) {
    return res.status(401).json({ 
      error: 'Error en autenticación',
      details: error.message 
    });
  }
};

/**
 * Middleware para validar roles de usuario
 * @param {Array} allowedRoles - Roles permitidos ['ADMIN', 'USER']
 */
export const validateRole = (allowedRoles = []) => {
  return (req, res, next) => {
    const userRole = req.user?.role || 'USER';
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        error: 'No tienes permisos para realizar esta acción' 
      });
    }
    
    next();
  };
};

/**
 * Middleware de logging simple
 */
export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
};
