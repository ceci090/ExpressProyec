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
  host: "127.0.0.1",
  user: "u668721882_Ceci",
  password: "Kcm1524.",
  database: "u668721882_Tortilleria7",
};

// Crear conexión a la base de datos MySQL
const pool = mysql.createPool(dbConfig);

// Ruta para obtener los permisos de un perfil
app.get('/perfil/:id/permiso', (req, res) => {
  const perfilId = req.params.id;

  // Consulta SQL para obtener los permisos de los módulos para el perfil
  const query = `
    SELECT 
      p.nombre AS perfil_nombre, 
      m.id AS modulo_id, 
      m.nombre AS modulo_nombre,
      pm.puede_agregar, pm.puede_editar, pm.puede_eliminar, pm.puede_consultar
    FROM perfiles p
    JOIN permisos pm ON p.id = pm.perfil_id
    JOIN modulos m ON pm.modulo_id = m.id
    WHERE p.id = ?
  `;

  // Ejecutar la consulta
  pool.query(query, [perfilId], (err, results) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      return res.status(500).send('Error al consultar la base de datos');
    }

    // Si no se encontraron resultados
    if (results.length === 0) {
      return res.status(404).send({ error: 'No se encontraron permisos para este perfil' });
    }

    // Enviar los datos de permisos al cliente (puedes usar JSON o renderizar una vista)
    res.json(results);
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
