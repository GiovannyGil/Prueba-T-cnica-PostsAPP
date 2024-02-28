import app from './app/app'
import './database/conexion'
import dotenv from 'dotenv'

// configurar las variables de entorno
dotenv.config()

// definir el puerto
const Port = process.env.PORT || 3000;
/**
 * EADDRINUSE: address already in use :::3000
 * si ocurre ese error, cambiar el puerto o reiniciar el servidor
 */


// iniciar el servidor
app.listen(Port, () => {
    console.log(`el servidor esta corriendo en el Puerto: ${Port}`)
})