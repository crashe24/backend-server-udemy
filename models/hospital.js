var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var hospitalEsquema = new Schema({
    nombre: { type: String, required: [true, 'El nombre del hospital es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'hospitales' });

module.exports = mongoose.model('Hospital', hospitalEsquema);