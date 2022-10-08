const conexion = require('../config/conexion.js');
var express = require('express') //llamamos a Express
var rutas = express()
const {body, validationResult} = require('express-validator');

rutas.get('/', function (req, res) {
    res.json({mensaje: '¡Hola Mundo!'})
})

rutas.get('/prestamos', function (req, res) {
    let sql = "select * from prestamos order by id"
    conexion.query(sql, (err, rows) => {
        if (err) throw err;
        else {
            res.json(rows)
        }
    })
})

rutas.get('/prestamos/:id', function (req, res) {
    conexion.query("select * from prestamos where id = ?", [req.params.id], (err, rows) => {
        if (err) throw err;
        else {
            res.json(rows)
        }
    })
})

rutas.post('/prestamos', [

        body('fecha', "Ingrese una fecha").exists(),
        body('devolucion', "Ingrese una fecha").exists(),
        body('entrega', "Ingrese una fecha").exists(),
        body('usuarios_id', "Campo debe ser un entero*").exists().isInt(),
    ],
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        let sql = "insert into  prestamos set ?"
        const fecha = new Date
        console.log('Registro recibido: ', req.body);
        let poststr = {
            fecha: req.body.fecha,
            devolucion: req.body.devolucion,
            entrega: req.body.entrega,
            usuarios_id: req.body.usuarios_id,
            created: fecha
        }
        conexion.query(sql, poststr, function (error, results) {
            if (error) throw error;
            if (results.affectedRows) {
                res.json({status: 'Registro guardado'})
            } else
                res.json({status: 'No se pudo guardar'})

        });
    })



rutas.put('/prestamos', [
    body('id').exists().isInt(),
    body('fecha', "Ingrese una fecha").exists(),
    body('devolucion', "Ingrese una fecha").exists(),
    body('entrega', "Ingrese una fecha").exists(),
    body('usuarios_id', )
        .exists()
        .isInt(),
], function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const fecha = new Date
    let sql = "update prestamos set fecha= ?, devolucion= ?, entrega= ?, usuarios_id= ?, modified = ? where id = ?"
    conexion.query(sql,
        [
            req.body.fecha,
            req.body.devolucion,
            req.body.entrega,
            req.body.usuarios_id,
            fecha,
            req.body.id
        ],
        function (error, results) {
            if (error) throw error;
            if (results.affectedRows) {
                res.json({status: 'Registro actualizado'})
            } else
                res.json({status: 'No se pudo actualizar'})
        });
});


rutas.delete('/prestamos/:id', function (req, res) {
    let sql = "delete from prestamos where id = ?"
    conexion.query(sql, [req.params.id], function (error, results) {
        if (error) throw error;
        if (results.affectedRows) {
            res.json({status: 'Registro eliminado'})
        } else
            res.json({status: 'No se pudo eliminar'})
    });
})

module.exports = rutas;
