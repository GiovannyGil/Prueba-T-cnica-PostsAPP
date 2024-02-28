import { Request, Response, NextFunction } from 'express'
import User from '../models/User.model'

// verificar si el username ya existe en la base de datos, si existe no se puede registrar
export const ChechUsernameExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fullName } = req.body
        const existingUser = await User.findOne({ fullName }) // buscar el usuario por su name
        if (existingUser) {
            return res.status(400).json({ message: 'El nombre de usuario ya existe' }) // si ya existe el usuario, enviar un mensaje de error
        }
        return next() // si no existe el usuario, continuar con el siguiente middleware
    } catch (error) {
        return res.status(500).json({ message: 'Error al verificar el nombre de usuario' }) // si hay un error, enviar un mensaje de error
    }
}

// verificar si el email ya existe en la base de datos, si existe no se puede registrar
export const ChechEmailExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body
        const existingUser = await User.findOne({ email }) // buscar el usuario por su email
        if (existingUser) {
            return res.status(400).json({ message: 'El correo electrónico ya existe' }) // si ya existe el usuario, enviar un mensaje de error
        }
        return next() // si no existe el usuario, continuar con el siguiente middleware
    } catch (error) {
        return res.status(500).json({ message: 'Error al verificar el correo electrónico' }) // si hay un error, enviar un mensaje de error
    }
}