// Para buscar en todas las colecciones a la ves
var express = require('express');
var app = express();

//importacion de los modelos 
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');


// Rutas 
// https://es.wikipedia.org/wiki/Anexo:C%C3%B3digos_de_estado_HTTP


// ==========================
// Busqueda Especifica
// ==========================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regexpBusqueda = new RegExp(busqueda, 'i');
    /*
    if (tabla == 'medico') {
        buscarMedicos(busqueda, regexpBusqueda)
            .then(respuesta => {
                res.status(200).json({
                    ok: true,
                    medicos: respuesta
                });
            });
    } else if (tabla == 'hospital') {
        buscarHospitales(busqueda, regexpBusqueda)
            .then(respuesta => {
                res.status(200).json({
                    ok: true,
                    hospitales: respuesta
                });
            });
    } else if (tabla == 'usuario') {
        buscarUsuario(busqueda, regexpBusqueda)
            .then(respuesta => {
                res.status(200).json({
                    ok: true,
                    medicos: respuesta
                });
            });
    } else {
        return res.status(400).json({
            ok: false,
            mensaje: 'la ruta no existe',
            error: { message: 'Tipo de coleccion no valido' }
        });
    };


    
    
    */
    var promesa;
    switch (tabla) {
        case 'hospital':
            promesa = buscarHospitales(busqueda, regexpBusqueda);
            break;
        case 'medico':
            promesa = buscarMedicos(busqueda, regexpBusqueda);
            break;
        case 'usuario':
            promesa = buscarUsuario(busqueda, regexpBusqueda);
            break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'la ruta no existe',
                error: { message: 'Tipo de coleccion no valido' }
            });


    };
    promesa
        .then(respuesta => {
            res.status(200).json({
                ok: true,
                [tabla]: respuesta //cuando se pone entre [tabla] se le dice a js que utiliza lo que tiene esa variable 
            });
        });


});


// ==========================
// Busqueda General
// ==========================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    // para que el parametro de entrada nos indique norte por ejemplo y en la busqueda sea insensible a mayusculas y minusculas
    // utilizamos expresiones regulares
    var regex = new RegExp(busqueda, 'i');

    // para buscar todo en paralelo 
    Promise.all([
            buscarHospitales(busqueda, regex),
            buscarMedicos(busqueda, regex),
            buscarUsuario(busqueda, regex)
        ])
        .then(respuesta => {
            res.status(200).json({
                ok: true,
                hospitales: respuesta[0],
                medicos: respuesta[1],
                usuarios: respuesta[2]
            });
        });
    // utilizamos la funcion que nos devuelve la promesa
    /*buscarHospitales(busqueda, regex)
        .then(hospitales => {
            res.status(200).json({
                ok: true,
                hospitales: hospitales
            });
        });*/




    //ahora para pasar esta busqueda a una promesa
    // se hace la promesa para que se busque en todas las colecciones 


});

//funcion para cambiarle a promesa 
function buscarHospitales(busqueda, expreg) {

    // retorno la promesa
    // tienen su resolve y su reject
    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: expreg })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {
                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(hospitales);
                }
            });
    });


}

//*************************
// Para medicos
//********************** */

//funcion para cambiarle a promesa 
function buscarMedicos(busqueda, expreg) {

    // retorno la promesa
    // tienen su resolve y su reject
    return new Promise((resolve, reject) => {
        Medico.find({ nombre: expreg })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos) => {
                if (err) {
                    reject('Error al cargar medicos', err);
                } else {
                    resolve(medicos);
                }
            });
    });


}


//*************************
// Para usuarios
//********************** */

//funcion para cambiarle a promesa 
function buscarUsuario(busqueda, expreg) {

    // retorno la promesa
    // tienen su resolve y su reject
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': expreg }, { 'email': expreg }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            });


    });



}


// escuchar petisiones al express
module.exports = app;