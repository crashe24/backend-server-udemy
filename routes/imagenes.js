var express = require('express');
var app = express();

// para crear el path de la imagen
const path = require('path');
// para validar si existe esa imagen en el path
const fs = require('fs');

app.get('/:tipo/:img', (req, res) => {

    var tipo = req.params.tipo;
    var img = req.params.img;

    // __dirname obtiene la ruta de donde me encuentro
    // no importa si no esta levantado en el servidor 

    var pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        var pathNoImage = path.resolve(__dirname, `../assets/no-img.jpg`);
        res.sendFile(pathNoImage);
    }


});

module.exports = app;