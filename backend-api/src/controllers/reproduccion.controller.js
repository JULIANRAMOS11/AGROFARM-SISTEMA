import { pool } from "../config/db.js";

// Obtener todos los registros de reproducción
export const getReproduccion = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT r.*, p.codigo_arete, p.sexo
      FROM reproduccion r
      LEFT JOIN pigs p ON r.pig_id = p.id
      ORDER BY r.fecha_servicio DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener reproducción por ID
export const getReproduccionById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(`
      SELECT r.*, p.codigo_arete, p.sexo
      FROM reproduccion r
      LEFT JOIN pigs p ON r.pig_id = p.id
      WHERE r.id = $1
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear nuevo registro de reproducción
export const createReproduccion = async (req, res) => {
  try {
    const {
      pig_id,
      tipo_servicio,
      fecha_servicio,
      verraco,
      fecha_probable_parto,
      estado,
      observaciones
    } = req.body;

    const { rows } = await pool.query(
      `INSERT INTO reproduccion 
       (pig_id, tipo_servicio, fecha_servicio, verraco, fecha_probable_parto, estado, observaciones)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [pig_id, tipo_servicio, fecha_servicio, verraco, fecha_probable_parto, estado || 'GESTANTE', observaciones]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar reproducción
export const updateReproduccion = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      pig_id,
      tipo_servicio,
      fecha_servicio,
      verraco,
      fecha_probable_parto,
      estado,
      observaciones
    } = req.body;

    const { rows } = await pool.query(
      `UPDATE reproduccion 
       SET pig_id = $1, tipo_servicio = $2, fecha_servicio = $3, verraco = $4,
           fecha_probable_parto = $5, estado = $6, observaciones = $7
       WHERE id = $8
       RETURNING *`,
      [pig_id, tipo_servicio, fecha_servicio, verraco, fecha_probable_parto, estado, observaciones, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar reproducción
export const deleteReproduccion = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      "DELETE FROM reproduccion WHERE id = $1 RETURNING *",
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

// === PARTOS ===

// Obtener todos los partos
export const getPartos = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT pa.*, p.codigo_arete, r.fecha_servicio
      FROM partos pa
      LEFT JOIN pigs p ON pa.pig_id = p.id
      LEFT JOIN reproduccion r ON pa.reproduccion_id = r.id
      ORDER BY pa.fecha_parto DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear nuevo parto
export const createParto = async (req, res) => {
  try {
    const {
      reproduccion_id,
      pig_id,
      fecha_parto,
      lechones_nacidos_vivos,
      lechones_nacidos_muertos,
      lechones_momificados,
      peso_promedio_lechon,
      observaciones
    } = req.body;

    const { rows } = await pool.query(
      `INSERT INTO partos 
       (reproduccion_id, pig_id, fecha_parto, lechones_nacidos_vivos, lechones_nacidos_muertos,
        lechones_momificados, peso_promedio_lechon, observaciones)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [reproduccion_id, pig_id, fecha_parto, lechones_nacidos_vivos, lechones_nacidos_muertos,
       lechones_momificados, peso_promedio_lechon, observaciones]
    );

    // Actualizar estado de reproducción a PARTO_REALIZADO
    if (reproduccion_id) {
      await pool.query(
        "UPDATE reproduccion SET estado = 'PARTO_REALIZADO' WHERE id = $1",
        [reproduccion_id]
      );
    }

    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar parto
export const updateParto = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      reproduccion_id,
      pig_id,
      fecha_parto,
      lechones_nacidos_vivos,
      lechones_nacidos_muertos,
      lechones_momificados,
      peso_promedio_lechon,
      observaciones
    } = req.body;

    const { rows } = await pool.query(
      `UPDATE partos 
       SET reproduccion_id = $1, pig_id = $2, fecha_parto = $3, 
           lechones_nacidos_vivos = $4, lechones_nacidos_muertos = $5,
           lechones_momificados = $6, peso_promedio_lechon = $7, observaciones = $8
       WHERE id = $9
       RETURNING *`,
      [reproduccion_id, pig_id, fecha_parto, lechones_nacidos_vivos, lechones_nacidos_muertos,
       lechones_momificados, peso_promedio_lechon, observaciones, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar parto
export const deleteParto = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      "DELETE FROM partos WHERE id = $1 RETURNING *",
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
