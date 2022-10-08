const conexion = require('../config/conexion.js');
var express = require('express') //llamamos a Express
var rutas = express()
const {body, validationResult} = require('express-validator');


rutas.get('/', function(req, res) {
    res.json({ mensaje: 'Funcionando correcto' })
})

rutas.get('/categorias', function(req, res) {
    let sql="select * from categorias order by id"
    conexion.query(sql,(err,rows)=>{
        if(err) throw err;
        else{
            res.json(rows)
        }
    })
})

rutas.get('/categorias/:id', function(req, res) {
    conexion.query("select * from categorias where id = ?", [req.params.id],(err,rows)=>{
        if(err) throw err;
        else{
            res.json(rows)
        }
    })
})

rutas.post('/categorias', [
    body('nombre', "Campo no puede estar vacio*").exists().notEmpty()
], function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    let sql = "insert into  categorias set ?"
    const fecha=new Date
    console.log('Registro recibido: ',req.body);
    let poststr = {
        nombre : req.body.nombre,
        created: fecha
    }
    conexion.query(sql, poststr, function (error, results) {
        if (error) throw error;
        if (results.affectedRows) {
            res.json({status: 'Registro guardado'})
        }
        else
            res.json({status: 'No se pudo guardar'})

    });
})


rutas.put('/categorias', [
    body('id', "Campo debe ser un entero*").exists().isInt(),
    body('nombre', "Campo no puede estar vacio*").exists().notEmpty()
], function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const fecha=new Date
    let sql = "update categorias set nombre= ?, modified = ? where id = ?"
    conexion.query(sql, [req.body.nombre, fecha, req.body.id], function (error, results) {
        if (error) throw error;
        if (results.affectedRows) {
            res.json({status: 'Registro actualizado'})
        }
        else
            res.json({status: 'No se pudo actualizar'})
    });
});



rutas.delete('/categorias/:id', function(req, res) {
    let sql ="delete from categorias where id = ?"
    conexion.query(sql, [req.params.id], function (error, results) {
        if (error) throw error;
        if (results.affectedRows) {
            res.json({status: 'Registro eliminado'})
        }
        else
            res.json({status: 'No se pudo eliminar'})
    });
})


module.exports=rutas;

