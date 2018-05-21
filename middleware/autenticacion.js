var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

// =======================================
// Verificar token
// ========================================

exports.verificaToken = function(req, res, next) {
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

        // en cualquier parte donde se utilice el verifica token se va a tener el usuario 

        req.usuario = decoded.usuario;
        next();
    });
}