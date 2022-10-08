const conexion = require('../config/conexion.js');
var express = require('express') //llamamos a Express
var rutas = express()
const {body, validationResult} = require('express-validator');



rutas.get('/', function (req, res) {
    res.json({mensaje: '¡Hola Mundo!'})
})

rutas.get('/pagos', function (req, res) {
    //res.json({ mensaje: '¡Listando registros!' })
    let sql = "select * from pagos order by id"
    conexion.query(sql, (err, rows) => {
        if (err) throw err;
        else {
            res.json(rows)
        }
    })
})

rutas.get('/pagos/:id', function (req, res) {
    conexion.query("select * from pagos where id = ?", [req.params.id], (err, rows) => {
        if (err) throw err;
        else {
            res.json(rows)
        }
    })
})


rutas.post('/pagos', [
        body('fecha', "Ingrese una fecha").exists(),
        body('valor', "Campo debe ser numerico*").exists().isNumeric(),
        body('concepto', "Campo no puede estar vacio*").exists().notEmpty(),
        body('usuarios_id', "Campo debe ser un entero*").exists().isInt(),
    ],
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        let sql = "insert into  pagos set ?"
        const fecha = new Date
        console.log('Registro recibido: ', req.body);
        let poststr = {
            fecha: req.body.fecha,
            valor: req.body.valor,
            concepto: req.body.concepto,
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


rutas.put('/pagos', [
    body('id', "Campo debe ser un entero*").exists().isInt(),
    body('fecha', "Ingrese una fecha").exists(),
    body('valor', "Campo debe ser numerico*").exists().isNumeric(),
    body('concepto', "Campo no puede estar vacio*").exists().notEmpty(),
    body('usuarios_id', "Campo debe ser un entero*").exists().isInt(),
], function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const fecha = new Date
    let sql = "update pagos set fecha= ?, valor= ?, concepto= ?, usuarios_id= ?, modified = ? where id = ?"
    conexion.query(sql,
        [
            req.body.fecha,
            req.body.valor,
            req.body.concepto,
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


rutas.delete('/pagos/:id', function (req, res) {
    let sql = "delete from pagos where id = ?"
    conexion.query(sql, [req.params.id], function (error, results) {
        if (error) throw error;
        if (results.affectedRows) {
            res.json({status: 'Registro eliminado'})
        } else
            res.json({status: 'No se pudo eliminar'})
    });
})

module.exports = rutas;

