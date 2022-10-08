const conexion = require('../config/conexion.js');
var express = require('express')
const {validationResult, body} = require("express-validator"); //llamamos a Express
var rutas = express()

//---------------- define las rutas de la API-------------------
// http://localhost:8000/
rutas.get('/', function(req, res) {
    res.json({ mensaje: '¡Hola Mundo!' })
})

//Listado de registro http://localhost:8000/usuarios
rutas.get('/usuarios', function(req, res) {
    //res.json({ mensaje: '¡Listando registros!' })
    let sql="select * from usuarios order by id"
    conexion.query(sql,(err,rows)=>{
    if(err) throw err;
    else{
        res.json(rows)
    }
    })
})

//Obtener un user dado su id http://localhost:8000/usuarios/5
//---- get one user
rutas.get('/usuarios/:id', function(req, res) {
    conexion.query("select * from usuarios where id = ?", [req.params.id],(err,rows)=>{
        if(err) throw err;
        else{
            res.json(rows)
        }
    })
})


//Guardar registro
//-- Insertar un usuario
rutas.post('/usuarios',[
    body('documento', "Digite un documento valido").exists().isInt(),
    body('nombres', ).exists(),
    body('apellidos', ).exists(),
    body('direccion', ).exists(),
    body('telefono', ).exists(),
    body('correo', "Ingrese un correo valido").exists().isEmail(),
], function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    let sql = "insert into usuarios set ?"
    const fecha=new Date
    console.log('Registro recibido: ',req.body);
    let poststr = {
        documento: req.body.documento,
        nombres : req.body.nombres,
        apellidos: req.body.apellidos,
        direccion: req.body.direccion,
        telefono: req.body.telefono,
        correo: req.body.correo,
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

rutas.put('/usuarios', [
    body('id').exists().isInt(),
    body('documento', "Digite un documento valido").exists().isInt(),
    body('nombres', ).exists(),
    body('apellidos', ).exists(),
    body('direccion', ).exists(),
    body('telefono', ).exists(),
    body('correo', "Ingrese un correo valido").exists().isEmail(),
],function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const fecha=new Date
 let sql = "update usuarios set documento= ?,nombres= ?,apellidos = ?,direccion =?, telefono = ?,correo= ?, modified = ? where id = ?"
    conexion.query(sql, [req.body.documento,req.body.nombres,req.body.apellidos,req.body.direccion,req.body.telefono,req.body.correo,fecha,req.body.id], function (error, results) {
       if (error) throw error;
       if (results.affectedRows) {
        res.json({status: 'Registro actualizado'})
      }
      else
        res.json({status: 'No se pudo actualizar'})
     });
 });


rutas.delete('/usuarios/:id', function(req, res) {
    let sql ="delete from usuarios where id = ?"
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

