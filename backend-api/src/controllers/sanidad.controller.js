import { pool } from "../config/db.js";

// Obtener todos los registros de sanidad
export const getSanidad = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT s.*, p.codigo_arete, p.sexo
      FROM sanidad s
      LEFT JOIN pigs p ON s.pig_id = p.id
      ORDER BY s.fecha DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener sanidad por ID
export const getSanidadById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(`
      SELECT s.*, p.codigo_arete, p.sexo
      FROM sanidad s
      LEFT JOIN pigs p ON s.pig_id = p.id
      WHERE s.id = $1
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener registros de sanidad por cerdo
export const getSanidadByPig = async (req, res) => {
  try {
    const { pig_id } = req.params;
    const { rows } = await pool.query(
      "SELECT * FROM sanidad WHERE pig_id = $1 ORDER BY fecha DESC",
      [pig_id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear nuevo registro de sanidad
export const createSanidad = async (req, res) => {
  try {
    const {
      pig_id,
      tipo,
      fecha,
      medicamento_vacuna,
      dosis,
      via_administracion,
      veterinario,
      diagnostico,
      tratamiento,
      costo,
      proxima_aplicacion,
      observaciones
    } = req.body;

    // 1. Validar existencia del cerdo
    const pigCheck = await pool.query("SELECT id FROM pigs WHERE id = $1", [pig_id]);
    if (pigCheck.rows.length === 0) {
      return res.status(404).json({ error: "El cerdo especificado no existe." });
    }

    // 2. Validar campos requeridos mínimos
    if (!medicamento_vacuna && !tratamiento) {
      return res.status(400).json({ error: "Debe especificar al menos un medicamento/vacuna o un tratamiento." });
    }

    const { rows } = await pool.query(
      `INSERT INTO sanidad 
       (pig_id, tipo, fecha, medicamento_vacuna, dosis, via_administracion, 
        veterinario, diagnostico, tratamiento, costo, proxima_aplicacion, observaciones)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [pig_id, tipo, fecha, medicamento_vacuna, dosis, via_administracion,
        veterinario, diagnostico, tratamiento, costo, proxima_aplicacion, observaciones]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error en createSanidad:", error);
    res.status(500).json({ ok: false, error: "Error interno del servidor", detail: error.message });
  }
};

// Actualizar sanidad
export const updateSanidad = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      pig_id,
      tipo,
      fecha,
      medicamento_vacuna,
      dosis,
      via_administracion,
      veterinario,
      diagnostico,
      tratamiento,
      costo,
      proxima_aplicacion,
      observaciones
    } = req.body;

    const { rows } = await pool.query(
      `UPDATE sanidad 
       SET pig_id = $1, tipo = $2, fecha = $3, medicamento_vacuna = $4, dosis = $5,
           via_administracion = $6, veterinario = $7, diagnostico = $8, tratamiento = $9,
           costo = $10, proxima_aplicacion = $11, observaciones = $12
       WHERE id = $13
       RETURNING *`,
      [pig_id, tipo, fecha, medicamento_vacuna, dosis, via_administracion,
        veterinario, diagnostico, tratamiento, costo, proxima_aplicacion, observaciones, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar sanidad
export const deleteSanidad = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      "DELETE FROM sanidad WHERE id = $1 RETURNING *",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    res.json({ message: "Registro eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener próximas aplicaciones
export const getProximasAplicaciones = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT s.*, p.codigo_arete
      FROM sanidad s
      LEFT JOIN pigs p ON s.pig_id = p.id
      WHERE s.proxima_aplicacion >= CURRENT_DATE
      ORDER BY s.proxima_aplicacion ASC
      LIMIT 20
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
