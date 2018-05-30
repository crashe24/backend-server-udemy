var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');


var mdAutenticacion = require('../middleware/autenticacion');

var app = express();

var Medico = require('../models/medico');


// =======================================
// Obtener todos los hospitales
// ========================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0; // debe ser un numero caso contrario no funciona
    // se hardcodea 
    desde = Number(desde);


    Medico.find({})
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .skip(desde) // funcion para que me salte desde y me obtenga 
        .limit(5) // limito a cinco los resultados
        .exec((err, medicos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando medicos',
                    errors: err
                });
            }
            Medico.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    medicos: medicos,
                    total: conteo
                });
            });

        });


});

// =======================================
// Crear  medico
// ========================================


app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: body.usuario,
        // medico.usuario = req.usuario._id
        hospital: body.hospital

    });

    medico.save((err, medico) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }
        // recurso creado
        res.status(201).json({
            ok: true,
            medico: medico
        });
    });


});

// =======================================
// Actualizar medico
// ========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Medico.findById(id, (err, medico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico para actualizar por el id',
                errors: err
            });


        }
        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico no existe',
                errors: { message: 'No existe el medico con ese id' }
            });
        }

        medico.nombre = body.nombre;
        medico.img = body.img;
        medico.usuario = body.usuario;
        // medico.usuario = req.usuario._id
        medico.hospital = body.hospital;

        medico.save((err, medicoActualizado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico  para actualizar por el id',
                    errors: err
                });


            }
            return res.status(400).json({
                ok: true,
                medico: medicoActualizado
            });
        });

    });
});
// =======================================
// Borrar hospitales hospitales
// ========================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res, next) => {
    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err
            });
        }

        //verifo si viene un usuario 
        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un medicoBorrado con ese id',
                errors: { message: 'No existe un medicoBorrado con este id' }
            });
        }

        res.status(200).json({
            ok: true,
            medicoBorrado: medicoBorrado
        });

    });
});


module.exports = app;