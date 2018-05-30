// Requires importacion de librerias de 3ros o personalizadas para que funcione

// referencia a la libreria express
var express = require('express');

// referencia a la libreria mongoose
var mongoose = require('mongoose');

// referencia a body-parser                           
var bodyParser = require('body-parser');


// inicializar variables
var app = express();

// body parser

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


// importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var loginRoutes = require('./routes/login');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');

// conexion a la bdd 
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, resp) => {
    // esto detiene todo el proceso ya no corre mas     
    if (err) throw err;

    console.log('Base de datos:  ,\x1b[32m%s\x1b[0m', 'online');
});


//IMPORTANTE Server index SE COMENTA PARA VER COMO SE USA
// posibilidad de ver los archivvos subidos
// npm install serve-index
// http://localhost:3000/uploads/
/*
var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/uploads', serveIndex(__dirname + '/uploads'));
*/



// Rutas 

// next significa que cuando se ejecute continue con la siguiente instruccion
// https://es.wikipedia.org/wiki/Anexo:C%C3%B3digos_de_estado_HTTP
/*
app.get('/', (request, response, next) => {
        response.status(200).json({
            ok: true,
            mensaje: 'Peticion realizada correctamente'
        })
    })*/
// escuchar petisiones al express

// midleware
app.use('/usuario', usuarioRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/login', loginRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/img', imagenesRoutes);
app.use('/upload', uploadRoutes);

// siempre debe ser la ultima ruta / caso contrario no funciona
app.use('/', appRoutes);


app.listen(3000, () => {
    console.log('Express server corriend0 en el puerto 3000: ,\x1b[32m%s\x1b[0m', 'online');
})