express = require('express');
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = 4000;

// Middleware
app.use(express.json());
app.use(cors());

// Obtener todos los empleados
app.get("/empleados", (req, res) => {
    pool.query("SELECT * FROM empleados", (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Obtener un empleado por ID
app.get("/empleados/:id", (req, res) => {
    const { id } = req.params;
    pool.query("SELECT * FROM empleados WHERE id = ?", [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Empleado no encontrado" });
        }
        res.json(results[0]);
    });
});
app.post("/api.php", (req, res) => {
    const { nombre, puesto, correo, telefono } = req.body;

    if (!nombre || !puesto || !correo || !telefono) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Lógica para insertar el nuevo empleado en la base de datos
    const query = 'INSERT INTO empleados (nombre, puesto, correo, telefono) VALUES (?, ?, ?, ?)';
    pool.query(query, [nombre, puesto, correo, telefono], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al insertar en la base de datos', details: err });
        }
        res.json({
            success: true,
            id: results.insertId, // Suponiendo que tu DB esté configurada para autoincrementar
            nombre,
            puesto,
            correo,
            telefono
        });
    });
});

// Eliminar un empleado
app.delete("/empleados/:id", (req, res) => {
    const { id } = req.params;
    pool.query("DELETE FROM empleados WHERE id = ?", [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Empleado eliminado correctamente" });
    });
});

// Actualizar los datos de un empleado
app.put("/empleados/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, puesto, correo, telefono } = req.body;

  if (!nombre || !puesto || !correo || !telefono) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  // Lógica para actualizar los datos del empleado en la base de datos
  const query = 'UPDATE empleados SET nombre = ?, puesto = ?, correo = ?, telefono = ? WHERE id = ?';
  pool.query(query, [nombre, puesto, correo, telefono, id], (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'Error al actualizar en la base de datos', details: err });
      }
      if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Empleado no encontrado" });
      }
      res.json({ success: true, message: "Empleado actualizado correctamente" });
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});