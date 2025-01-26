const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Servir archivos estáticos desde la carpeta raíz
app.use(express.static(path.join(__dirname, '/')));

// Ruta para la página de inicio (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html')); // Ruta para la página de login
});

// Ruta para la página de menú (menu.htm)
app.get('/menu', (req, res) => {
  res.sendFile(path.join(__dirname, 'menu.htm')); // Ruta para la página de menú
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
