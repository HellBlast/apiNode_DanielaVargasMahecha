var express = require('express') //llamamos a Express
const bodyParser = require('body-parser');//------------------
var app = express()   
app.use(bodyParser.json())  //-------------
var port = process.env.PORT || 8000  // establecemos nuestro puerto
//-- para dar accesos desde cualquier servidor
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

 // Routes llama a los controladores
app.use('/',require('./controller/usuarioController'));
app.use('/',require('./controller/categoriaController'));
app.use('/',require('./controller/editorialController'));
app.use('/',require('./controller/libroController'));
app.use('/',require('./controller/prestamoController'));
app.use('/',require('./controller/pagoController'));

// iniciamos nuestro servidor
app.listen(port)
console.log('Servidor NodeJs Runing en http://localhost:' + port);
console.log('Para terminar presione las teclas Ctrl+C');
