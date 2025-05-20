const db = require("../db");

// Insertar una persona con su dirección e información del INE
exports.insertarTodo = (req, res) => {
  const {
    nombre,
    apellido_paterno,
    apellido_materno,
    curp,
    domicilio,
    estado,
    municipio,
    seccion,
    clave_elector,
    vigencia
  } = req.body;

  const personaSQL = `INSERT INTO persona (nombre, apellido_paterno, apellido_materno, curp) VALUES (?, ?, ?, ?)`;
  db.query(personaSQL, [nombre, apellido_paterno, apellido_materno, curp], (err, personaResult) => {
    if (err) return res.status(500).json({ error: err.message });

    const id_persona = personaResult.insertId;

    const direccionSQL = `INSERT INTO direccion (id_persona, domicilio, estado, municipio, seccion) VALUES (?, ?, ?, ?, ?)`;
    db.query(direccionSQL, [id_persona, domicilio, estado, municipio, seccion], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });

      const ineSQL = `INSERT INTO ine (id_persona, clave_elector, vigencia) VALUES (?, ?, ?)`;
      db.query(ineSQL, [id_persona, clave_elector, vigencia], (err3) => {
        if (err3) return res.status(500).json({ error: err3.message });

        res.status(201).json({ message: "Datos insertados correctamente" });
      });
    });
  });
};

// Obtener todas las personas con su información relacionada
exports.obtenerTodo = (req, res) => {
  const sql = `
    SELECT p.*, d.domicilio, d.estado, d.municipio, d.seccion,
           i.clave_elector, i.vigencia
    FROM persona p
    LEFT JOIN direccion d ON p.id = d.id_persona
    LEFT JOIN ine i ON p.id = i.id_persona
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Buscar persona por ID
exports.buscarPorId = (req, res) => {
  const sql = `
    SELECT p.*, d.domicilio, d.estado, d.municipio, d.seccion,
           i.clave_elector, i.vigencia
    FROM persona p
    LEFT JOIN direccion d ON p.id = d.id_persona
    LEFT JOIN ine i ON p.id = i.id_persona
    WHERE p.id = ?
  `;

  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0] || {});
  });
};

// Buscar persona por CURP
exports.buscarPorCurp = (req, res) => {
  const sql = `
    SELECT p.*, d.domicilio, d.estado, d.municipio, d.seccion,
           i.clave_elector, i.vigencia
    FROM persona p
    LEFT JOIN direccion d ON p.id = d.id_persona
    LEFT JOIN ine i ON p.id = i.id_persona
    WHERE p.curp = ?
  `;

  db.query(sql, [req.params.curp], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0] || {});
  });
};

// Eliminar persona por CURP
exports.eliminarPorCurp = (req, res) => {
  const curp = req.params.curp;

  db.query("SELECT id FROM persona WHERE curp = ?", [curp], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ error: "CURP no encontrado" });

    const id_persona = result[0].id;

    db.query("DELETE FROM ine WHERE id_persona = ?", [id_persona], (err1) => {
      if (err1) return res.status(500).json({ error: err1.message });

      db.query("DELETE FROM direccion WHERE id_persona = ?", [id_persona], (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });

        db.query("DELETE FROM persona WHERE id = ?", [id_persona], (err3) => {
          if (err3) return res.status(500).json({ error: err3.message });

          res.json({ message: "Datos eliminados correctamente" });
        });
      });
    });
  });
};
