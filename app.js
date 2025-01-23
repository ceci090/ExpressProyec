const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Configurar la carpeta 'styles' como estática
app.get('/style.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'styles', 'style.css'));
});


// Servir el archivo index.html desde la raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
