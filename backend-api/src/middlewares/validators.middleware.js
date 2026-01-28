/**
 * Middleware de Validación
 * Valida datos de entrada en requests
 */

/**
 * Valida que los campos requeridos estén presentes
 * @param {Array} requiredFields - Array de nombres de campos requeridos
 */
export const validateRequiredFields = (requiredFields = []) => {
  return (req, res, next) => {
    const missingFields = [];
    
    requiredFields.forEach(field => {
      if (!req.body[field] || req.body[field].toString().trim() === '') {
        missingFields.push(field);
      }
    });
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Campos requeridos faltantes',
        missingFields
      });
    }
    
    next();
  };
};

/**
 * Valida formato de email
 */
export const validateEmail = (req, res, next) => {
  const { email } = req.body;
  
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Formato de email inválido'
      });
    }
  }
  
  next();
};

/**
 * Valida que un ID sea un número válido
 */
export const validateId = (req, res, next) => {
  const { id } = req.params;
  
  if (isNaN(parseInt(id))) {
    return res.status(400).json({
      error: 'ID inválido. Debe ser un número.'
    });
  }
  
  next();
};

/**
 * Valida formato de fecha (YYYY-MM-DD)
 */
export const validateDate = (fieldName) => {
  return (req, res, next) => {
    const dateValue = req.body[fieldName];
    
    if (dateValue) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(dateValue)) {
        return res.status(400).json({
          error: `Formato de fecha inválido en ${fieldName}. Use YYYY-MM-DD`
        });
      }
    }
    
    next();
  };
};
