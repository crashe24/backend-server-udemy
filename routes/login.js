var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();

var Usuario = require('../models/usuario');

// ==============================
//  autenticacion google
// ==============================
// google
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

var CLIENT_ID = require('../config/config').CLIENT_ID;

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

/*
npm install google-auth-library --save
*/
app.post('/google', async(req, res) => {

    var token = req.body.token;

    var googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                mensaje: 'Toke no valido'
            });
        });

    // vamos a crear el usuario en nuestra coleccion de usuarios 

    // verificar que mi correo viene ahi                                 
    Usuario.findOne({ email: googleUser.email }, (err, usuarioBdd) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al autenticar con google'
            });
        }
        if (usuarioBdd) {
            if (usuarioBdd.google === false) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Debe usar su autenticacion normal'
                });
            } else {
                var token = jwt.sign({ usuario: usuarioBdd }, SEED, { expiresIn: 14400 })

                res.status(200).json({
                    ok: true,
                    usuario: usuarioBdd,
                    token: token,
                    id: usuarioBdd.id
                });
            }
        } else {
            // El usuario no existe hay que crearlo 
            var usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ":)";

            usuario.save((err, usuarioBdd) => {
                var token = jwt.sign({ usuario: usuarioBdd }, SEED, { expiresIn: 14400 })

                res.status(200).json({
                    ok: true,
                    usuario: usuarioBdd,
                    token: token,
                    id: usuarioBdd.id
                });
            });
        }
    });

    // res.status(200).json({
    //     ok: true,
    //     mensaje: 'OK!!!',
    //     google: googleUser
    // });
});




// ==============================
//  autenticacion normal
// ==============================


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