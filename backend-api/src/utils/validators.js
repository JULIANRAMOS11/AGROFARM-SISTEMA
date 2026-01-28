/**
 * Utilidades de Validación
 * Funciones reutilizables para validar datos
 */

/**
 * Valida formato de email
 * @param {string} email 
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida formato de teléfono (básico)
 * @param {string} phone 
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.length >= 7;
};

/**
 * Valida formato de fecha YYYY-MM-DD
 * @param {string} date 
 * @returns {boolean}
 */
export const isValidDate = (date) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(date);
};

/**
 * Valida que un valor sea un número positivo
 * @param {*} value 
 * @returns {boolean}
 */
export const isPositiveNumber = (value) => {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
};

/**
 * Valida rango de valores
 * @param {number} value 
 * @param {number} min 
 * @param {number} max 
 * @returns {boolean}
 */
export const isInRange = (value, min, max) => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= min && num <= max;
};

/**
 * Sanitiza string (elimina caracteres peligrosos)
 * @param {string} str 
 * @returns {string}
 */
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/[<>]/g, '').trim();
};
