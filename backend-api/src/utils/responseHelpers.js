/**
 * Utilidades para Respuestas HTTP Estandarizadas
 */

/**
 * Respuesta de éxito con datos
 * @param {Object} res - Response object
 * @param {*} data - Datos a enviar
 * @param {string} message - Mensaje opcional
 * @param {number} statusCode - Código de estado (default: 200)
 */
export const successResponse = (res, data, message = 'Operación exitosa', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Respuesta de error
 * @param {Object} res - Response object
 * @param {string} message - Mensaje de error
 * @param {number} statusCode - Código de estado (default: 400)
 */
export const errorResponse = (res, message = 'Error en la operación', statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    error: message
  });
};

/**
 * Respuesta de recurso creado
 * @param {Object} res - Response object
 * @param {*} data - Datos del recurso creado
 * @param {string} message - Mensaje opcional
 */
export const createdResponse = (res, data, message = 'Recurso creado exitosamente') => {
  return res.status(201).json({
    success: true,
    message,
    data
  });
};

/**
 * Respuesta de recurso no encontrado
 * @param {Object} res - Response object
 * @param {string} message - Mensaje opcional
 */
export const notFoundResponse = (res, message = 'Recurso no encontrado') => {
  return res.status(404).json({
    success: false,
    error: message
  });
};

/**
 * Respuesta de no autorizado
 * @param {Object} res - Response object
 * @param {string} message - Mensaje opcional
 */
export const unauthorizedResponse = (res, message = 'No autorizado') => {
  return res.status(401).json({
    success: false,
    error: message
  });
};

/**
 * Respuesta de prohibido
 * @param {Object} res - Response object
 * @param {string} message - Mensaje opcional
 */
export const forbiddenResponse = (res, message = 'Acceso denegado') => {
  return res.status(403).json({
    success: false,
    error: message
  });
};
