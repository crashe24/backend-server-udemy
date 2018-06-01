var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
//para otra paginacion 
var mongoosePaginate = require('mongoose-paginate');


var Schema = mongoose.Schema;


// si queremos controlar el rol que ingresa lo procedemos hacer lo siguiente: 
var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un usuario valido'
}

var usuarioEsquema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'El password  es necesario'] },
    img: { type: String, required: false, default: '' },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos },
    google: { type: Boolean, default: false }

});


//var Model = mongoose.model('Model', usuarioEsquema); // Model.paginate()

//para indicar que el validator va a estar en el esquema de usuario esquema
// usuarioEsquema.plugin(uniqueValidator, { message: 'el correo debe de ser unico' });
// usuarioEsquema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' }); se 
// pone path para que coja el atributo ya que si existen mas campos unicos pues deberia coger cual es del
// incoveniente.
usuarioEsquema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });
usuarioEsquema.plugin(mongoosePaginate);

module.exports = mongoose.model('Usuario', usuarioEsquema);