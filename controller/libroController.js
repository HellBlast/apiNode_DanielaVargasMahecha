const conexion = require('../config/conexion.js');
var express = require('express') //llamamos a Express
var rutas = express()
const {body, validationResult} = require('express-validator');

rutas.get('/', function (req, res) {
    res.json({mensaje: '¡Hola Mundo!'})
})

rutas.get('/libros', function (req, res) {
    let sql = "select * from libros order by id"
    conexion.query(sql, (err, rows) => {
        if (err) throw err;
        else {
            res.json(rows)
        }
    })
})

rutas.get('/libros/:id', function (req, res) {
    conexion.query("select * from libros where id = ?", [req.params.id], (err, rows) => {
        if (err) throw err;
        else {
            res.json(rows)
        }
    })
})

rutas.post('/libros', [
    body('titulo', "Campo no puede estar vacio*").exists().notEmpty(),
    body('descripcion', "Campo no puede estar vacio*").exists().notEmpty(),
    body('precio', "Campo debe ser numerico*").exists().isNumeric(),
    body('ejemplares', "Campo debe ser entero").exists().isInt(),
    body('autor', "Campo no puede estar vacio*").exists().notEmpty(),
    body('editoriales_id', "Campo debe ser un entero*").exists().isInt(),
    body('categorias_id', "Campo debe ser un entero*").exists().isInt(),

], function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    let sql = "insert into  libros set ?"
    const fecha = new Date
    console.log('Registro recibido: ', req.body);
    let poststr = {
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        precio: req.body.precio,
        ejemplares: req.body.ejemplares,
        autor: req.body.autor,
        editoriales_id: req.body.editoriales_id,
        categorias_id: req.body.categorias_id,
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


rutas.put('/libros', [
    body('id', "Campo debe ser un entero*").exists().isInt(),
    body('titulo', "Campo no puede estar vacio*").exists().notEmpty(),
    body('descripcion', "Campo no puede estar vacio*").exists().notEmpty(),
    body('precio', "Campo debe ser numerico*").exists().isNumeric(),
    body('ejemplares', "Campo debe ser entero").exists().isInt(),
    body('autor', "Campo no puede estar vacio*").exists().notEmpty(),
    body('editoriales_id', "Campo debe ser un entero*").exists().isInt(),
    body('categorias_id', "Campo debe ser un entero*").exists().isInt(),

], function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const fecha = new Date
    let sql = "update libros set titulo= ?, descripcion= ?, precio= ?, ejemplares= ?, autor= ?, editoriales_id= ?, categorias_id= ?, modified = ? where id = ?"
    conexion.query(sql,
        [req.body.titulo, req.body.descripcion, req.body.precio, req.body.ejemplares, req.body.autor, req.body.editoriales_id, req.body.categorias_id, fecha, req.body.id],
        function (error, results) {
            if (error) throw error;
            if (results.affectedRows) {
                res.json({status: 'Registro actualizado'})
            } else
                res.json({status: 'No se pudo actualizar'})
        });
});

rutas.delete('/libros/:id', function (req, res) {
    let sql = "delete from libros where id = ?"
    conexion.query(sql, [req.params.id], function (error, results) {
        if (error) throw error;
        if (results.affectedRows) {
            res.json({status: 'Registro eliminado'})
        } else
            res.json({status: 'No se pudo eliminar'})
    });
})

module.exports = rutas;

