import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import User from '../models/User.model'
import { sendVerificationEmail } from '../services/SendEmail.services'

// funciones Auth -> autenticacion con JWT
// clase -> palabra clave -> llave -> key
const MySecretKey = 'secret'

// funcion para generar token
const generateToken = (userID: string): string => {
    return jwt.sign({userID}, process.env.SECRET_KEY || MySecretKey, {expiresIn: '1h'}) 
    // esta funcion realiza la firma del token, con el userID, la llave secreta y el tiempo de expiracion
}

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra un nuevo usuario.
 *     description: Registra un nuevo usuario con los datos proporcionados en el cuerpo de la solicitud y envía un correo electrónico de verificación.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: Nombre completo del usuario.
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario.
 *               age:
 *                 type: number
 *                 description: Edad del usuario.
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario.
 *     responses:
 *       '201':
 *         description: Usuario registrado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token de autenticación generado.
 *                 message:
 *                   type: string
 *                   description: Mensaje de éxito.
 *                 verificationLink:
 *                   type: string
 *                   description: Enlace de verificación enviado al correo electrónico del usuario.
 *                 message2:
 *                   type: string
 *                   description: Mensaje adicional con el enlace de verificación.
 *       '500':
 *         description: Error al registrar el usuario.
 */

// funcion para reguistrar un usuario -> generar token
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { fullName, email, age, password } = req.body // obtener los datos del usuario
        const hashedPassword = await bcrypt.hash(password, 10) // cifrar el password con 10 vueltas
        const newUser = new User({
            fullName,
            email,
            age,
            password: hashedPassword
        })
        await newUser.save() // guardar el usuario
        const token = generateToken(newUser._id.toString()) // generar el token con el id del usuario

        // Enviar correo electrónico de verificación
        const verificationLink = `http://localhost:3000/api/auth/verify/${newUser._id}`; // Generar el enlace de verificación
        await sendVerificationEmail(email, fullName, verificationLink); // Llamar a la función para enviar el correo electrónico



        res.status(201).json({
            token, 
            message: "Usuario registrado correctamente, por favor, verifica tu correo electrónico para activar tu cuenta",
            verificationLink,
            message2: "El enlace de verificación ha sido enviado a tu correo electrónico o entra a este enlace para verificar tu cuenta: http://localhost:3000/api/auth/verify/:userId"
        }) // enviar el token al cliente
    } catch (error) {
        res.status(500).json({message: "Error al registrar el usuario"})
    }
}

/**
 *  * /api/auth/login:
 *   post:
 *     summary: Inicia sesión de usuario.
 *     description: Inicia sesión de usuario con los datos proporcionados en el cuerpo de la solicitud.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario.
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario.
 *     responses:
 *       '200':
 *         description: Sesión iniciada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token de autenticación generado.
 *       '404':
 *         description: Usuario no encontrado.
 *       '400':
 *         description: Contraseña incorrecta.
 *       '500':
 *         description: Error al iniciar sesión.
 */

// funcion para logearse -> iniciar sesion -> generar token
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body // obtener los datos del usuario
        const user = await User.findOne({email}) // buscar el usuario por su email
        if(!user) return res.status(404).json({message: "Usuario no encontrado"}) // si no existe el usuario, enviar un mensaje de error

        const isMatch = await bcrypt.compare(password, user.password) // comparar el password
        if(!isMatch) return res.status(400).json({message: "Password incorrecto"}) // si el password es incorrecto, enviar un mensaje de error

        const token = generateToken(user._id.toString()) // generar el token con el id del usuario
        return res.status(200).json({token}) // enviar el token al cliente
    } catch (error) {
        return res.status(500).json({message: "Error al iniciar sesión"})
    }
}

/**
 *  * /api/auth/logout:
 *   get:
 *     summary: Cierra sesión de usuario.
 *     description: Cierra sesión de usuario y elimina el token de autenticación.
 *     responses:
 *       '200':
 *         description: Sesión cerrada correctamente.
 *       '401':
 *         description: Token de autorización no proporcionado.
 *       '500':
 *         description: Error al cerrar sesión.
 */

// funcion para logout -> cerrar sesion -> eliminar token
export const Logout = async (req: Request, res: Response) => {
    try {
        // pasar el token por el header
        const token = req.headers['x-access-token'] // Obtener el token del header

        if (!token) {
            res.status(401).json({ message: 'Token de autorización no proporcionado' });
        }

        res.clearCookie('token', { httpOnly: true }); // Eliminar la cookie 'token' del navegador del cliente
        res.status(200).json({ message: "Sesión cerrada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al cerrar sesión" });
    }
}

/**
 *  * /api/auth/refresh-token:
 *   get:
 *     summary: Refresca el token de autenticación.
 *     description: Verifica el token de autenticación proporcionado y genera un nuevo token de autenticación.
 *     responses:
 *       '200':
 *         description: Token de autenticación actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Nuevo token de autenticación generado.
 *       '401':
 *         description: Token de autorización inválido.
 */

// funcion para refrescar el token -> generar un nuevo token
export const refreshToken = async (req: Request, res: Response) => {
    // pasar el token por el header
    const token = req.headers['x-access-token'] // Obtener el token del header
    if (!token) {
        return res.status(401).json({ message: 'Token de autorización no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token as string, MySecretKey) as { userID: string } // Verificar el token
        const newToken = generateToken(decoded.userID); // Generar un nuevo token
        return res.status(200).json({ token: newToken }); // Enviar el nuevo token al cliente
    } catch (error) {
        return res.status(401).json({ message: 'Token de autorización inválido' });
    } 
}