const mqtt = require('mqtt');

// Configuración del broker MQTT
const brokerUrl = 'ws://test.mosquitto.org:8080/mqtt'; // Cambia esto al broker MQTT que estés utilizando
const topic = 'Clatua/sensor'; // Ajusta el tema MQTT según tu configuración

// Importar el modelo de Mongoose
const ProyectoModel = require('./models').ProyectoModel;

// Crear un cliente MQTT
const client = mqtt.connect(brokerUrl);

// Conectar al broker MQTT
client.on('connect', () => {
  console.log('Conectado al broker MQTT');

  // Suscribirse al tema
  client.subscribe(topic, (err) => {
    if (err) {
      console.error('Error al suscribirse al tema', err);
    } else {
      console.log(`Suscrito al tema: ${topic}`);
    }
  });
});

// Manejar mensajes recibidos
client.on('message', async (topic, message) => {
  if (topic === 'Clatua/sensor') {
    const sensor = JSON.parse(message.toString());
    console.log('Mensaje recibido desde el topic clatua:');
    console.log(sensor);

    // Crear un nuevo documento con los datos del sensor
    const nuevoDocumento = new ProyectoModel(sensor);

    try {
      // Guardar el nuevo documento en la colección
      await nuevoDocumento.save();

      // Emitir un evento de socket cuando se agrega un nuevo documento
      const io = require('./config').app.io;
      io.emit('nuevoDocumento', { message: 'Nuevo documento agregado', nuevoDocumento: sensor });
    } catch (error) {
      console.error('Error al agregar el documento:', error);
      const io = require('./config').app.io;
      // Emitir un evento de error al cliente
      io.emit('errorAgregarDocumento', { error: 'Error al agregar el documento' });
    }
  }
});

// Manejar errores
client.on('error', (err) => {
  console.error('Error en el cliente MQTT:', err);
});

// Manejar cierre de conexión
client.on('close', () => {
  console.log('Conexión MQTT cerrada');
});

// Manejar desconexión
client.on('offline', () => {
  console.log('Cliente MQTT desconectado');
});

// Manejar reconexión
client.on('reconnect', () => {
  console.log('Intentando reconectar al broker MQTT');
});

module.exports = client; // Exportar el cliente MQTT para usarlo en otros archivos si es necesario
