const express = require('express');
const router = express.Router();

// Importar el cliente MQTT
const mqttClient = require('./mqttHandler');

// Importa los modelos de Mongoose desde models.js
const { ProyectoModel } = require('./models');
// Ruta para la página de inicio
router.get('/', (req, res) => {
  res.sendFile('index.html', {root: __dirname + '/../public/'})
});

// Ruta para la página de todos los documentos
router.get('/allDoc', (req, res) => {
  res.sendFile('views/allDoc.html', { root: __dirname + '/../public/' });
});

// Ruta para la página del mapa
router.get('/maps', (req, res) => {
  res.sendFile('views/maps.html', { root: __dirname + '/../public/' });
});

// Ruta para la página del equipo
router.get('/team', (req, res) => {
  res.sendFile('views/team.html', { root: __dirname + '/../public/' });
});

// Ruta para la página de wokwi
router.get('/wokwi', (req, res) => {
  res.sendFile('views/wokwi.html', { root: __dirname + '/../public/' });
});

// Ruta para la página de el dato mas reciente
router.get('/dataDB', (req, res) => {
  res.sendFile('views/dataDB.html', { root: __dirname + '/../public/' });
  const socket = req.app.io;
  socket.emit('joinDataDB');
});

// Ruta para obtener documentos de la colección "Proyecto"
router.get('/obtenerP', async (req, res) => {
  try {
    const documentos = await ProyectoModel.find();
    res.json(documentos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener documentos' });
  }
});

// Ruta para agregar un documento a la colección "Proyecto"
router.post('/agregarP', async (req, res) => {
  const { temperature, humedad, co2, movement, day, time } = req.body;
  try {
    const nuevoDocumento = new ProyectoModel({ temperature, humedad, co2, movement, day, time });
    await nuevoDocumento.save();
    const io = req.app.io;
    // Emitir evento de socket cuando se agrega un nuevo documento
    io.emit('nuevoDocumento', { message: 'Nuevo documento agregado', nuevoDocumento });

    res.json({ message: 'Documento agregado con éxito' });
  } catch (error) {
    console.error('Error al agregar el documento:', error);
    const io = req.app.io;
    // Emitir un evento de error al cliente
    io.emit('errorAgregarDocumento', { error: 'Error al agregar el documento' });

    res.status(500).json({ error: 'Error al agregar el documento' });
  }
});


// Ruta para obtener el último documento de la colección "Proyecto"
router.get('/obtenerUltimoDocumento', async (req, res) => {
  try {
    // Obtener el último documento ordenando por _id de forma descendente y tomando el primero
    const ultimoDocumento = await ProyectoModel.findOne().sort({ _id: -1 });

    if (ultimoDocumento) {
      res.json(ultimoDocumento);
    } else {
      res.status(404).json({ error: 'No hay documentos en la colección' });
    }
  } catch (error) {
    console.error('Error al obtener el último documento:', error);
    res.status(500).json({ error: 'Error al obtener el último documento' });
  }
});


// Ruta para editar un documento por _id en la colección "Proyecto"
router.put('/editarP/:id', async (req, res) => {
  const { id } = req.params;
  const { temperature, humi, co2, movement, day, time } = req.body;
  try {
    await ProyectoModel.findByIdAndUpdate(id, { temperature, humi, co2, movement, day, time });

    // Acceder a io desde app
    const io = req.app.io;

    // Emitir evento de socket cuando se edita un documento
    io.emit('documentoEditado', { message: 'Documento editado con éxito', id, updatedData: { temperature, humi, co2, movement, day, time } });

    res.json({ message: 'Documento editado con éxito' });
  } catch (error) {
    console.error('Error al editar el documento:', error);

    // Acceder a io desde app
    const io = req.app.io;

    // Emitir un evento de error al cliente
    io.emit('errorEditarDocumento', { error: 'Error al editar el documento' });

    res.status(500).json({ error: 'Error al editar el documento' });
  }
});


// Ruta para eliminar un documento por _id en la colección "Proyecto"
router.delete('/eliminarP/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await ProyectoModel.findByIdAndDelete(id);
    // Acceder a io desde app
    const io = req.app.io;

    // Emitir evento de socket cuando se elimina un documento
    io.emit('documentoEliminado', { message: 'Documento eliminado con éxito', id });

    res.json({ message: 'Documento eliminado con éxito' });
  } catch (error) {
    const io = req.app.io;

    // Emitir un evento de error al cliente
    io.emit('errorEliminarDocumento', { error: 'Error al eliminar el documento' });

    res.status(500).json({ error: 'Error al eliminar el documento' });
  }
});

module.exports = router;
