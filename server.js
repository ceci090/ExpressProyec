const express = require('express');
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = 4000;

// Conexión a MySQL
const pool = mysql.createPool({
    host: 'localhost',
    user: 'tu_usuario',
    password: 'tu_contraseña',
    database: 'tu_base_de_datos'
});

// Middleware
app.use(express.json());
app.use(cors());

/* -------------------------- EMPLEADOS -------------------------- */

// Obtener todos los empleados
app.get("/empleados", (req, res) => {
    pool.query("SELECT * FROM empleados", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Obtener un empleado por ID
app.get("/empleados/:id", (req, res) => {
    const { id } = req.params;
    pool.query("SELECT * FROM empleados WHERE id = ?", [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "Empleado no encontrado" });
        res.json(results[0]);
    });
});

// Crear nuevo empleado
app.post("/empleados", (req, res) => {
    const { nombre, puesto, correo, telefono } = req.body;
    if (!nombre || !puesto || !correo || !telefono) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    const query = 'INSERT INTO empleados (nombre, puesto, correo, telefono) VALUES (?, ?, ?, ?)';
    pool.query(query, [nombre, puesto, correo, telefono], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al insertar en la base de datos', details: err });
        res.json({ success: true, id: results.insertId, nombre, puesto, correo, telefono });
    });
});

// Eliminar empleado
app.delete("/empleados/:id", (req, res) => {
    const { id } = req.params;
    pool.query("DELETE FROM empleados WHERE id = ?", [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Empleado eliminado correctamente" });
    });
});

// Actualizar empleado
app.put("/empleados/:id", (req, res) => {
    const { id } = req.params;
    const { nombre, puesto, correo, telefono } = req.body;
    if (!nombre || !puesto || !correo || !telefono) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    const query = 'UPDATE empleados SET nombre = ?, puesto = ?, correo = ?, telefono = ? WHERE id = ?';
    pool.query(query, [nombre, puesto, correo, telefono, id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar', details: err });
        if (results.affectedRows === 0) return res.status(404).json({ message: "Empleado no encontrado" });
        res.json({ success: true, message: "Empleado actualizado correctamente" });
    });
});

/* -------------------------- VENTAS -------------------------- */

// Obtener todas las ventas
app.get("/ventas", (req, res) => {
    pool.query("SELECT * FROM ventas", (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
});
  
// Obtener una venta por ID
app.get("/ventas/:id", (req, res) => {
    const { id } = req.params;
    pool.query("SELECT * FROM ventas WHERE id = ?", [id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ message: "Venta no encontrada" });
      res.json(results[0]);
    });
});
  
// Crear nueva venta
app.post("/ventas", (req, res) => {
    const { usuario_id, cliente_id, fecha, total } = req.body;
    if (!usuario_id || !cliente_id || !fecha || !total) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
  
    const query = 'INSERT INTO ventas (usuario_id, cliente_id, fecha, total) VALUES (?, ?, ?, ?)';
    pool.query(query, [usuario_id, cliente_id, fecha, total], (err, results) => {
      if (err) return res.status(500).json({ error: 'Error al registrar la venta', details: err });
      res.json({ success: true, id: results.insertId });
    });
});
  
// Actualizar venta
app.put("/ventas", (req, res) => {
    const { id, usuario_id, cliente_id, fecha, total } = req.body;
    const query = "UPDATE ventas SET usuario_id = ?, cliente_id = ?, fecha = ?, total = ? WHERE id = ?";
    pool.query(query, [usuario_id, cliente_id, fecha, total, id], (err, results) => {
      if (err) return res.status(500).json({ error: 'Error al actualizar la venta', details: err });
      res.json({ success: true });
    });
});
  
// Eliminar venta
app.delete("/ventas/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM ventas WHERE id = ?";
    pool.query(query, [id], (err, results) => {
      if (err) return res.status(500).json({ error: 'Error al eliminar la venta', details: err });
      res.json({ success: true });
    });
});

  

/* -------------------------- GASTOS -------------------------- */

// Obtener todos los gastos
app.get("/gastos", (req, res) => {
    pool.query("SELECT * FROM gastos", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Obtener un gasto por folio
app.get("/gastos/:folio", (req, res) => {
    const { folio } = req.params;
    pool.query("SELECT * FROM gastos WHERE folio = ?", [folio], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "Gasto no encontrado" });
        res.json(results[0]);
    });
});

// Crear un nuevo gasto
app.post("/gastos", (req, res) => {
    const { concepto, monto } = req.body;
    if (!concepto || !monto) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const query = 'INSERT INTO gastos (concepto, monto) VALUES (?, ?)';
    pool.query(query, [concepto, monto], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al registrar el gasto', details: err });
        res.json({ success: true, folio: results.insertId });
    });
});

// Eliminar un gasto
app.delete("/gastos/:folio", (req, res) => {
    const { folio } = req.params;
    pool.query("DELETE FROM gastos WHERE folio = ?", [folio], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar el gasto', details: err });
        res.json({ success: true, message: "Gasto eliminado correctamente" });
    });
});

// Actualizar un gasto
app.put("/gastos/:folio", (req, res) => {
    const { folio } = req.params;
    const { concepto, monto } = req.body;

    if (!concepto || !monto) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const query = 'UPDATE gastos SET concepto = ?, monto = ? WHERE folio = ?';
    pool.query(query, [concepto, monto, folio], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar el gasto', details: err });
        if (results.affectedRows === 0) return res.status(404).json({ message: "Gasto no encontrado" });
        res.json({ success: true, message: "Gasto actualizado correctamente" });
    });
});
/* -------------------------- PRODUCCION -------------------------- */

// Obtener todos los registros de producción
app.get("/produccion", (req, res) => {
    pool.query("SELECT * FROM produccion", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Obtener un registro de producción por id
app.get("/produccion/:id", (req, res) => {
    const { id } = req.params;
    pool.query("SELECT * FROM produccion WHERE id = ?", [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "Producción no encontrada" });
        res.json(results[0]);
    });
});

// Crear un nuevo registro de producción
app.post("/produccion", (req, res) => {
    const { fecha, lote, produccion_kg } = req.body;
    if (!fecha || !lote || !produccion_kg) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const query = 'INSERT INTO produccion (fecha, lote, produccion_kg) VALUES (?, ?, ?)';
    pool.query(query, [fecha, lote, produccion_kg], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al registrar la producción', details: err });
        res.json({ success: true, id: results.insertId });
    });
});

// Eliminar un registro de producción
app.delete("/produccion/:id", (req, res) => {
    const { id } = req.params;
    pool.query("DELETE FROM produccion WHERE id = ?", [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar la producción', details: err });
        res.json({ success: true, message: "Producción eliminada correctamente" });
    });
});

// Actualizar un registro de producción
app.put("/produccion/:id", (req, res) => {
    const { id } = req.params;
    const { fecha, lote, produccion_kg } = req.body;

    if (!fecha || !lote || !produccion_kg) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const query = 'UPDATE produccion SET fecha = ?, lote = ?, produccion_kg = ? WHERE id = ?';
    pool.query(query, [fecha, lote, produccion_kg, id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar la producción', details: err });
        if (results.affectedRows === 0) return res.status(404).json({ message: "Producción no encontrada" });
        res.json({ success: true, message: "Producción actualizada correctamente" });
    });
});
/* -------------------------- INICIAR SERVIDOR -------------------------- */

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
