const mysql = require('mysql');
const conexion = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'biblioteca'
    }
);
conexion.connect(
    err => {
        if (err) {
            console.log('Error al conectar a la BD: ' + err)
        } else {
            console.log('Conectado correctamente a ala BD')
        }
    }
);
module.exports = conexion;
