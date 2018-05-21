var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();

var Usuario = require('../models/usuario');

//ruta para el login
app.post('/', (req, res) => {
    var body = req.body;
    //console.log(body);
    // verificamos si existe un usuario con ese correo electronico

    Usuario.findOne({ email: body.email }, (err, usuarioBdd) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        // si no existe un usuari de bdd con ese correo electronico
        if (!usuarioBdd) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email', //dash email se quita a la hora de poner en produccion 
                errors: err
            });
        }

        //verificar la contrasena

        if (!bcrypt.compareSync(body.password, usuarioBdd.password)) { //`${body.password}`, usuarioBdd.password)) {

            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password', //dash email se quita a la hora de poner en produccion 
                errors: err
            });

        }

        // Crear el token
        // buscar en github jsonwebtoke
        //npm install jsonwebtoke --save para instalar en nuestras dependencias
        // var token = jwt.sign({payload},clave, fecha_expiracion)
        // ocultamos el pass
        // para validar el token nos vamos a https:// jwr.io y se pone el token generado y en donde dice 
        // verifi signature se pone la-clave-este-es-un-seed
        usuarioBdd.password = ":)";
        var token = jwt.sign({ usuario: usuarioBdd }, SEED, { expiresIn: 14400 })

        res.status(200).json({
            ok: true,
            usuario: usuarioBdd,
            token: token,
            id: usuarioBdd.id
        });
    });
    //

});

//export para poder usar este archivo en otro lado por ejemplo en el app.js de la raiz
module.exports = app;