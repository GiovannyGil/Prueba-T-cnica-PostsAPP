import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

const MySecretKey = 'secret'

// definir el tipo de request que tiene el user en el request (req) -> middleware 
export interface UserRequest extends Request {
    user?: { id: string } // define el user en el request como un objeto con un id

}

// verificar si el token hay token y su hay es valido -> middleware


// verificar si el user esta logeado -> middleware
export const authenticateUser = (req: UserRequest, res: Response, next: NextFunction) => {
    const token = req.headers['x-access-token'] as string
    if (!token) {
        return res.status(401).json({ message: 'Token de autorización no proporcionado' })
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET || MySecretKey) as { userId: string }
        req.user = { id: decoded.userId }
        return next()
    } catch (error) {
        return res.status(401).json({ message: 'Token de autorización inválido' })
    }
}