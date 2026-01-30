import { pool } from "../config/db.js";

// Obtener todos los registros de producción
export const getProduccion = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT pr.*, p.codigo_arete, p.sexo
      FROM produccion pr
      LEFT JOIN pigs p ON pr.pig_id = p.id
      ORDER BY pr.fecha DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener producción por ID
export const getProduccionById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(`
      SELECT pr.*, p.codigo_arete, p.sexo
      FROM produccion pr
      LEFT JOIN pigs p ON pr.pig_id = p.id
      WHERE pr.id = $1
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener producción por cerdo
export const getProduccionByPig = async (req, res) => {
  try {
    const { pig_id } = req.params;
    const { rows } = await pool.query(
      "SELECT * FROM produccion WHERE pig_id = $1 ORDER BY fecha DESC",
      [pig_id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear nuevo registro de producción
export const createProduccion = async (req, res) => {
  try {
    const {
      pig_id,
      fecha,
      peso,
      edad_dias,
      ganancia_diaria,
      consumo_alimento_kg,
      conversion_alimenticia,
      lote,
      observaciones
    } = req.body;

    // 1. Validar existencia del cerdo
    const pigCheck = await pool.query("SELECT id FROM pigs WHERE id = $1", [pig_id]);
    if (pigCheck.rows.length === 0) {
      return res.status(404).json({ error: "El cerdo especificado no existe." });
    }

    // 2. Validar valores positivos (Sanity Check)
    if (peso <= 0) return res.status(400).json({ error: "El peso debe ser mayor a 0." });
    if (edad_dias < 0) return res.status(400).json({ error: "La edad no puede ser negativa." });

    // Opcional: Validar fecha no futura
    if (new Date(fecha) > new Date()) {
      return res.status(400).json({ error: "No se pueden registrar datos de producción con fecha futura." });
    }

    const { rows } = await pool.query(
      `INSERT INTO produccion 
       (pig_id, fecha, peso, edad_dias, ganancia_diaria, consumo_alimento_kg,
        conversion_alimenticia, lote, observaciones)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [pig_id, fecha, peso, edad_dias, ganancia_diaria, consumo_alimento_kg,
        conversion_alimenticia, lote, observaciones]
    );

    // Actualizar peso actual del cerdo
    if (peso) {
      await pool.query(
        "UPDATE pigs SET peso_actual = $1 WHERE id = $2",
        [peso, pig_id]
      );
    }

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error en createProduccion:", error);
    res.status(500).json({ ok: false, error: "Error interno del servidor", detail: error.message });
  }
};

// Actualizar producción
export const updateProduccion = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      pig_id,
      fecha,
      peso,
      edad_dias,
      ganancia_diaria,
      consumo_alimento_kg,
      conversion_alimenticia,
      lote,
      observaciones
    } = req.body;

    const { rows } = await pool.query(
      `UPDATE produccion 
       SET pig_id = $1, fecha = $2, peso = $3, edad_dias = $4, ganancia_diaria = $5,
           consumo_alimento_kg = $6, conversion_alimenticia = $7, lote = $8, observaciones = $9
       WHERE id = $10
       RETURNING *`,
      [pig_id, fecha, peso, edad_dias, ganancia_diaria, consumo_alimento_kg,
        conversion_alimenticia, lote, observaciones, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    // Actualizar peso actual del cerdo si es el registro más reciente
    if (peso) {
      await pool.query(
        "UPDATE pigs SET peso_actual = $1 WHERE id = $2",
        [peso, pig_id]
      );
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar producción
export const deleteProduccion = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      "DELETE FROM produccion WHERE id = $1 RETURNING *",
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

// Obtener estadísticas de producción
export const getEstadisticasProduccion = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        COUNT(DISTINCT pig_id) as total_cerdos,
        AVG(peso) as peso_promedio,
        AVG(ganancia_diaria) as ganancia_promedio,
        AVG(conversion_alimenticia) as conversion_promedio
      FROM produccion
      WHERE fecha >= CURRENT_DATE - INTERVAL '30 days'
    `);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
