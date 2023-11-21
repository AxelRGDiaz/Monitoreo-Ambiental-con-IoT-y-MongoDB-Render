const { app, port, server } = require('./src/config');
const routes = require('./src/routes');
// Importa los modelos de Mongoose desde models.js
const { ProyectoModel } = require('./src/models');
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const mqttClient = require('./src/mqttHandler');

// Configurar socket.io
io.on('connection', (socket) => {
  console.log('Usuario conectado');

  // Manejar la conexión del socket cuando se accede a la ruta /dataDB
  socket.on('joinDataDB', () => {
    // Emitir el último documento al nuevo cliente que se conecta
    ProyectoModel.findOne().sort({ _id: -1 })
      .then((ultimoDocumento) => {
        if (ultimoDocumento) {
          socket.emit('ultimoDocumento', ultimoDocumento);
        }
      })
      .catch((error) => {
        console.error('Error al obtener el último documento:', error);
      });
  });

  // Puedes agregar más lógica aquí para manejar otros eventos de socket si es necesario
});

// Pasa el servidor HTTP a la aplicación para que socket.io pueda interceptar solicitudes HTTP
app.server = httpServer;
app.io = io;

// Usar las rutas definidas en routes.js
app.use('/', routes);

// En qué puerto está corriendo la app
httpServer.listen(port, () => {
  console.log(`Aplicación Node.js escuchando en el puerto ${port}`);
});
