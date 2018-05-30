// se va a utilizar la libreria express-fileupload

var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();

//fileSystem
var fs = require('fs');


//importaciones de los modelos 
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// default options midleware
app.use(fileUpload());

app.put('/:tipo/:id', (req, res) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // tipos de coleccion 
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'tipo no valido',
            errors: { message: 'Los tipos permitidos son : ' + tiposValidos.join(', ') }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Problemas al subir el archivo',
            errors: { message: 'Debe seleccionar una imagen' }
        });
    }
    // obtener nombre del archivo 
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extension = nombreCortado[nombreCortado.length - 1];

    //solo estas extensiones aceptamos
    var listaExtensiones = ['png', 'jpg', 'jpeg', 'gif'];

    if (listaExtensiones.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: 'Las extensiones validas son : ' + listaExtensiones.join(', ') }
        });
    }

    // nombre de archivo personalizado
    // 11111222-123.png extension
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
    //mover el archivo del temporal a un path
    var path = `./uploads/${ tipo }/${ nombreArchivo}`;

    archivo.mv(path, err => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Mover archivo',
                errors: { message: 'No se pudo mover el archivo' }
            });
        }

        //cambiamos la respuesta para enviarla en una funcion
        // esta hara la subida 
        subirImagenPorTipo(tipo, id, nombreArchivo, res);

        // res.status(200).json({
        //     ok: true,
        //     mensaje: 'Archivo movido',
        //     extension: extension
        // });
    });


});

function subirImagenPorTipo(tipo, id, nombreArchivo, res) {
    //validacion para la imagen de usuario
    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuarioBdd) => {

            // validacion si no existe el usuario 
            if (!usuarioBdd) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'usuario no existe' }

                });
            }

            var pathViejo = './uploads/usuarios/' + usuarioBdd.img;

            // si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, function(err) {
                    if (err) {
                        return console.error(err);
                    }
                    console.log('file deleted');
                });

            }
            usuarioBdd.img = nombreArchivo;

            usuarioBdd.save((err, usuarioActualizado) => {
                usuarioActualizado.password = ':)';
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Mover archivo de usuario',
                        errors: { message: 'No se pudo mover el archivo del usuario' }
                    });
                }
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuarioActualizado: usuarioActualizado
                });
            });
        });
    }
    if (tipo === 'medicos') {
        Medico.findById(id, (err, medicoBdd) => {
            if (!medicoBdd) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Medico no existe',
                    errors: { message: 'medico no existe' }

                });
            }

            var pathViejo = './uploads/medicos/' + medicoBdd.img;

            // si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, function(err) {
                    if (err) {
                        return console.error(err);
                    }
                    console.log('file deleted');
                });

            }
            medicoBdd.img = nombreArchivo;

            medicoBdd.save((err, medicoActualizado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Mover archivo de medico',
                        errors: { message: 'No se pudo mover el archivo de medico' }
                    });
                }
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    medico: medicoActualizado
                });
            });
        });
    }
    if (tipo === 'hospitales') {
        Hospital.findById(id, (err, hospitalBdd) => {

            if (!hospitalBdd) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Hospital no existe',
                    errors: { message: 'hospital no existe' }

                });
            }
            var pathViejo = './uploads/hospitales/' + hospitalBdd.img;

            // si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, function(err) {
                    if (err) {
                        return console.error(err);
                    }
                    console.log('file deleted');
                });

            }
            hospitalBdd.img = nombreArchivo;

            hospitalBdd.save((err, hospitalActualizado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Mover archivo de hospital',
                        errors: { message: 'No se pudo mover el archivo de hospital' }
                    });
                }
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    hospital: hospitalActualizado
                });
            });
        });
    }
}
module.exports = app;