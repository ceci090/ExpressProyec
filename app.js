const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const app = express();
const port = 400;

// Middleware para procesar JSON de todas las rutas
app.use(express.json());

// Servir archivos estáticos desde la raíz del proyecto (sin carpeta 'public')
app.use(express.static(__dirname));

// Ruta para la página de inicio (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html')); // Ruta sin la carpeta 'public'
});

// Ruta para la página de menú (menu.html)
app.get('/menu', (req, res) => {
  res.sendFile(path.join(__dirname, 'menu.html')); // Ruta sin la carpeta 'public'
});

// Ruta para la página de "Nosotros" (nosotros.html)
app.get('/nosotros', (req, res) => {
  res.sendFile(path.join(__dirname, 'nosotros.html')); // Ruta sin la carpeta 'public'
});

// Configuración de la conexión a la base de datos MySQL
const dbConfig = {
  host: "127.0.0.1", // Asegúrate de que tu MySQL esté en el puerto correcto
  user: "u668721882_rbMqU", // Cambia según tu configuración
  password: "Kcm42990", // La contraseña de la base de datos
  database: "u668721882_r1lFO",
};

// Crear conexión a la base de datos MySQL
const pool = mysql.createPool(dbConfig);

// Ruta para obtener datos de la base de datos (ejemplo)
app.get('/api/data', (req, res) => {
  pool.query('SELECT * FROM your_table', (err, results) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      return res.status(500).send('Error al consultar la base de datos');
    }
    res.json(results); // Devuelve los datos de la consulta
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
