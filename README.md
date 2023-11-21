# Monitoreo Ambiental con IoT y MongoDB

Este proyecto combina IoT y MongoDB para monitorear el entorno. Sensores conectados a un ESP32 generan datos que, a través de MQTT y WiFi, llegan al middleware. Los documentos JSON resultantes se almacenan en MongoDB, actualizando en tiempo real una interfaz de usuario, ofreciendo un monitoreo ambiental inteligente y dinámico.

## Instalación

1. Clona este repositorio: `git clone https://github.com/tu-usuario/tu-proyecto.git`
2. Instala las dependencias: `npm install`

## Configuración

Antes de ejecutar la aplicación, asegúrate de configurar adecuadamente los siguientes archivos:

### `.env` 

Crea un archivo `.env` en el directorio raíz del proyecto y proporciona los siguientes valores:

```env
ElUsuario=TuNombreDeUsuario
LaContra=TuContraseña
```
## Uso
1. Inicia la aplicación: `npm start`
2. Accede a la aplicación desde tu navegador: `http://localhost:3000`

## Dependencias

Aquí están las dependencias utilizadas en el proyecto:
```
- body-parser
- cors
- dotenv
- express
- mongoose
- mqtt
- socket.io
- socket.io-client
```