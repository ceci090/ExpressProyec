require('dotenv').config(); // Cargar variables de entorno
const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001; // Usa el puerto definido en la nube o el 3001

app.use(cors());
app.use(express.json());

// Configuración de la base de datos SQL Server con variables de entorno
const dbConfig = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASS || '123456',
  server: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'Base',
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// Función para ejecutar consultas SQL
async function ejecutarConsulta(query, params = []) {
  try {
    let pool = await sql.connect(dbConfig);
    let request = pool.request();

    // Agregar parámetros si existen
    params.forEach((param) => request.input(param.name, param.type, param.value));

    let result = await request.query(query);
    return result.recordset;
  } catch (err) {
    console.error('❌ Error al ejecutar consulta:', err);
    return null;
  }
}

// Rutas de empleados
app.get('/empleados', async (req, res) => {
  try {
    const empleados = await ejecutarConsulta('SELECT * FROM dbo.Empleados');
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener empleados' });
  }
});

app.post('/empleados', async (req, res) => {
  const { nombre, puesto } = req.body;

  if (!nombre || !puesto) {
    return res.status(400).json({ error: 'Nombre y puesto son obligatorios' });
  }

  const query = `INSERT INTO dbo.Empleados (nombre, puesto) VALUES (@nombre, @puesto)`;
  const params = [
    { name: 'nombre', type: sql.VarChar, value: nombre },
    { name: 'puesto', type: sql.VarChar, value: puesto },
  ];

  try {
    await ejecutarConsulta(query, params);
    res.status(201).json({ mensaje: 'Empleado agregado con éxito' });
  } catch (err) {
    console.error('❌ Error al insertar empleado:', err);
    res.status(500).json({ error: 'Error al agregar empleado' });
  }
});

app.put('/empleados/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, puesto } = req.body;

  if (!nombre || !puesto) {
    return res.status(400).json({ error: 'Nombre y puesto son obligatorios' });
  }

  const query = `UPDATE dbo.Empleados SET nombre = @nombre, puesto = @puesto WHERE id = @id`;
  const params = [
    { name: 'nombre', type: sql.VarChar, value: nombre },
    { name: 'puesto', type: sql.VarChar, value: puesto },
    { name: 'id', type: sql.Int, value: id },
  ];

  try {
    await ejecutarConsulta(query, params);
    res.json({ mensaje: 'Empleado actualizado con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar empleado' });
  }
});

app.delete('/empleados/:id', async (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM dbo.Empleados WHERE id = @id`;
  const params = [{ name: 'id', type: sql.Int, value: id }];

  try {
    await ejecutarConsulta(query, params);
    res.json({ mensaje: 'Empleado eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar empleado' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});

// Exportar app para pruebas (opcional)
module.exports = app;
