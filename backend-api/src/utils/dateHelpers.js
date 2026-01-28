/**
 * Utilidades para Manejo de Fechas
 */

/**
 * Calcula fecha probable de parto (114 días después del servicio)
 * @param {Date|string} serviceDate 
 * @returns {Date}
 */
export const calculateExpectedBirthDate = (serviceDate) => {
  const date = new Date(serviceDate);
  date.setDate(date.getDate() + 114);
  return date;
};

/**
 * Calcula edad en días desde una fecha
 * @param {Date|string} birthDate 
 * @returns {number}
 */
export const calculateAgeInDays = (birthDate) => {
  const birth = new Date(birthDate);
  const today = new Date();
  const diffTime = Math.abs(today - birth);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Formatea fecha a YYYY-MM-DD
 * @param {Date} date 
 * @returns {string}
 */
export const formatDateToSQL = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Verifica si una fecha es pasada
 * @param {Date|string} date 
 * @returns {boolean}
 */
export const isPastDate = (date) => {
  return new Date(date) < new Date();
};

/**
 * Verifica si una fecha es futura
 * @param {Date|string} date 
 * @returns {boolean}
 */
export const isFutureDate = (date) => {
  return new Date(date) > new Date();
};

/**
 * Obtiene diferencia en días entre dos fechas
 * @param {Date|string} date1 
 * @param {Date|string} date2 
 * @returns {number}
 */
export const getDaysDifference = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
