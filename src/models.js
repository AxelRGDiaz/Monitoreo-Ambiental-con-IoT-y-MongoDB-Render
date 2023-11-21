const mongoose = require('mongoose');



// Definir modelo para la colección "Proyecto"
const ProyectoModel = mongoose.model('Proyecto', new mongoose.Schema({
  temperature: Number,
  humedad: Number,
  co2: Number,
  movement: String,
  day: String,
  time: String
}, { collection: 'Proyecto', versionKey: false }));

module.exports = { ProyectoModel };
