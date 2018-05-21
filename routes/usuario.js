var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');


var mdAutenticacion = require('../middleware/autenticacion');

//var SEED = require('../config/config').SEED;


var app = express();

var Usuario = require('../models/usuario');



// =======================================
// Obtener todos los usuarios
// ========================================

app.get('/', (request, response, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec(
            (err, usuarios) => {
                if (err) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios',
                        errors: err
                    });
                }
                response.status(200).json({
                    ok: true,
                    usuarios: usuarios
                });
            });

});
// escuchar petisiones al express


// =======================================
// Verificar token
// ========================================

// esta no es una manera muy practica de ejecutar 
// se va a cambiar esto se pasa a cambiar a un archivo autenticacion 
/*
app.use('/', (req, res, next) => {
    // se necesita revisar el token 
    var token = req.query.token;
    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'token incorrecto',
                errors: err
            });
        }

        next();
    });


});
*/


/*======================ACTUALIZAR UN REGISTRO DE USUARIO ==============================*/

// =======================================
// Crear un nuevo usuario
// ========================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    //obtener el id
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {


        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {
            return response.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id: ' + id + 'no existe',
                errors: { message: 'No existe un usuario con ese id' }
            });
        }


        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }
            // recurso creado
            //esto evita que se muestre el password
            usuarioGuardado.password = ':)';
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });


});

/*======================FIN DE ACTUALIZAR UN REGISTRO DE USUARIO =======================*/




// =======================================
// Crear un nuevo usuario
// ========================================
// se cambia app.post('/', (req, res) => { por lo de abajo se aumenta un segundo parametro de entrada
// para la verificacion del token

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    // utilizaremos una libreria que se llama body parser node
    //  https://github.com/expressjs/body-parser
    // npm install body-parser

    var body = req.body;

    // vamos a guardar mediante moongose 
    // crear el usuario
    // var salt = bcrypt.genSaltSync(10);
    // var hash = bcrypt.hashSync("B4c0/\/", salt);
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), // aqui se encripta la contraseña
        img: body.img,
        role: body.role

    });

    // pluggin para controlar el error 
    // npm install mongoose-unique-validator --save

    // guardar el usuario 
    // falta 
    usuario.save((err, usuarioGuardado) => {
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
            usuario: usuarioGuardado,
            usuarioToken: req.usuario // utilizamos al usuario obtenido desde la autenticacion
        });
    });
});


/*======================ELIMINAR UN REGISTRO DE USUARIO ==============================*/

// =======================================
// Eliminar un nuevo usuario
// ========================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }

        //verifo si viene un usuario 
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese id',
                errors: { message: 'No existe un usuario con este id' }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    });
});

module.exports = app;