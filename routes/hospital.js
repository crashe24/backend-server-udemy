var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');


var mdAutenticacion = require('../middleware/autenticacion');

var app = express();

var Hospital = require('../models/hospital');


// =======================================
// Obtener todos los hospitales
// ========================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0; // debe ser un numero caso contrario no funciona
    // se hardcodea 
    desde = Number(desde);
    Hospital.find({})
        .populate('usuario', 'nombre email') //sirve para llenar objetos dentro de los objetos buscados 
        // mandamos como segundo parametro el nombre y el email
        .skip(desde) // funcion para que me salte desde y me obtenga 
        .limit(5) // limito a cinco los resultados
        .exec((err, hospitales) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando hospitales',
                    errors: err
                });
            }
            Hospital.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    hospitales: hospitales,
                    total: conteo
                });
            });

        });


});

// =======================================
// Crear  hospitales
// ========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id //body.usuario
            //usuario:req.usuario._id En la peticion del postman 
            // ya no es necesario enviarlo en el new hospital 
            // nombre : hospital y listo el usuario se coje automaticamente


    });

    hospital.save((err, hospital) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        }
        // recurso creado
        res.status(201).json({
            ok: true,
            hospital: hospital
        });
    });

});
// =======================================
// Actualizar hospitales
// ========================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico para actualizar por el id',
                errors: err
            });


        }
        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital no existe',
                errors: { message: 'No existe el hospital con ese id' }
            });
        }

        hospital.nombre = body.nombre;
        hospital.img = body.img;
        hospital.usuario = body.usuario;
        //tambien hay como hospital.usuario = req.usuario._id;
        // nombre : hospital y listo el usuario se coje automaticament

        hospital.save((err, hospitalActualizado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico para actualizar por el id',
                    errors: err
                });


            }
            return res.status(400).json({
                ok: true,
                medico: hospitalActualizado
            });
        });

    });
});


// =======================================
// Borrar hospitales hospitales
// ========================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res, next) => {
    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }

        //verifo si viene un usuario 
        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un hospitalBorrado con ese id',
                errors: { message: 'No existe un hospitalBorrado con este id' }
            });
        }

        res.status(200).json({
            ok: true,
            hospitalBorrado: hospitalBorrado
        });

    });
});

module.exports = app;