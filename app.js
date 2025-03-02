const express = require('express');
const path = require('path');
const sql = require('mssql');
const app = express();
const port = 3001;

app.use(express.json()); // Middleware para procesar JSON de todas las rutas

// Configuración de la base de datos SQL Server
const dbConfig = {
  user: 'sa',
  password: '123456',
  server: 'localhost',
  database: 'Base', // Nombre de tu base de datos
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// Función para ejecutar consultas SQL
async function ejecutarConsulta(query, params = []) {
  try {
    console.log("Ejecutando consulta:", query);  // Log de la consulta que se ejecuta
    let pool = await sql.connect(dbConfig);
    let request = pool.request();

    params.forEach((param) => request.input(param.name, param.type, param.value));

    let result = await request.query(query);
    return result.recordset;
  } catch (err) {
    console.error('Error al ejecutar consulta:', err);  // Log del error
    return null;
  }
}


// Servir archivos estáticos desde la carpeta raíz
app.use(express.static(path.join(__dirname, '/')));

// Ruta para la página de inicio (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para la página de menú (menu.html)
app.get('/menu', (req, res) => {
  res.sendFile(path.join(__dirname, 'menu.html'));
});

// Ruta para la página de "Nosotros" (nosotros.html)
app.get('/nosotros', (req, res) => {
  res.sendFile(path.join(__dirname, 'nosotros.html'));
});

// Ruta para obtener todos los empleados
app.get('/empleados', async (req, res) => {
  console.log("Solicitud recibida para obtener empleados..."); // Esto es un log

  try {
    const empleados = await ejecutarConsulta('SELECT * FROM dbo.Empleados');
    console.log("Empleados obtenidos:", empleados); // Log de los empleados obtenidos
    res.json(empleados);
  } catch (error) {
    console.error("Error al obtener empleados:", error); // Log de error
    res.status(500).json({ error: 'Error al obtener empleados' });
  }
});


// Ruta para agregar un empleado
app.post('/empleados', async (req, res) => {
  const { nombre, puesto } = req.body;

  if (!nombre || !puesto) {
    return res.status(400).json({ error: 'Nombre y puesto son obligatorios' });
  }

  const query = 'INSERT INTO dbo.Empleados (nombre, puesto) VALUES (@nombre, @puesto)';
  const params = [
    { name: 'nombre', type: sql.VarChar, value: nombre },
    { name: 'puesto', type: sql.VarChar, value: puesto },
  ];

  const result = await ejecutarConsulta(query, params);
  if (result) {
    res.status(201).json({ mensaje: 'Empleado agregado con éxito' });
  } else {
    res.status(500).json({ error: 'Error al agregar el empleado' });
  }
});

// Ruta para editar un empleado
app.put('/empleados/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, puesto } = req.body;

  if (!nombre || !puesto) {
    return res.status(400).json({ error: 'Nombre y puesto son obligatorios' });
  }

  const query = 'UPDATE dbo.Empleados SET nombre = @nombre, puesto = @puesto WHERE id = @id';
  const params = [
    { name: 'nombre', type: sql.VarChar, value: nombre },
    { name: 'puesto', type: sql.VarChar, value: puesto },
    { name: 'id', type: sql.Int, value: id },
  ];

  const result = await ejecutarConsulta(query, params);
  if (result) {
    res.json({ mensaje: 'Empleado actualizado con éxito' });
  } else {
    res.status(500).json({ error: 'Error al actualizar el empleado' });
  }
});

// Ruta para eliminar un empleado
app.delete('/empleados/:id', async (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM dbo.Empleados WHERE id = @id';
  const params = [{ name: 'id', type: sql.Int, value: id }];

  const result = await ejecutarConsulta(query, params);
  if (result) {
    res.json({ mensaje: 'Empleado eliminado con éxito' });
  } else {
    res.status(500).json({ error: 'Error al eliminar el empleado' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
