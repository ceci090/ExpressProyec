const sql = require('mssql');

const config = {
    user: 'sa', // Usuario de la base de datos
    password: '123456', // Contraseña de la base de datos
    server: 'LAPTOP-EPK90OJA', // IP de localhost
    database: 'Base', // Nombre de tu base de datos
    port: 1433, // Puerto de conexión de SQL Server
    options: {
        encrypt: true, // Si es necesario para la encriptación (dependiendo de tu configuración de SQL Server)
        trustServerCertificate: true // Para evitar problemas con certificados SSL en algunas configuraciones
    }
};

async function connectDB() {
    try {
        await sql.connect(config);
        console.log('Conectado a la base de datos');
    } catch (error) {
        console.error('Error de conexión a la base de datos:', error);
    }
}

module.exports = { connectDB, sql };
