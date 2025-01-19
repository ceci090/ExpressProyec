const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Configura la carpeta "public" para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal para servir "index.html"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
