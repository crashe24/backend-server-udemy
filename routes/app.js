// al inicio se encuentraba en el app.js de inicio pero se lo mueve para tener una mejor organizacion
var express = require('express');
var app = express();

// Rutas 
// next significa que cuando se ejecute continue con la siguiente instruccion
// https://es.wikipedia.org/wiki/Anexo:C%C3%B3digos_de_estado_HTTP

app.get('/', (request, response, next) => {
    response.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    })
});
// escuchar petisiones al express

module.exports = app;