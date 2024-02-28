import { Request, Response } from 'express'
import User from '../models/User.model'
import bcrypt from 'bcrypt'
// funcion para optener la informacion del usuario (propia informacion)
// funcion para obtener todos los usuarios

/**
 * @swagger
 *  /api/user/:
 *   get:
 *     summary: Obtiene todos los usuarios.
 *     description: Obtiene todos los usuarios registrados en el sistema.
 *     responses:
 *       '200':
 *         description: Usuarios obtenidos exitosamente.
 *       '500':
 *         description: Error al obtener los usuarios.
 */

export const getUsers = async (_req: Request, res: Response) => {
    try {
        const users = await User.find({ deletedAt: null })
        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener los usuarios' })
    }
}

/**
 * * /api/user/{userId}:
 *   get:
 *     summary: Obtiene la información de un usuario por su ID.
 *     description: Obtiene la información de un usuario específico por su ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario.
 *     responses:
 *       '200':
 *         description: Información del usuario obtenida exitosamente.
 *       '404':
 *         description: Usuario no encontrado.
 *       '500':
 *         description: Error al obtener la información del usuario.
 */

// funcion para obtener el usuario por id
export const getUserInfo = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId // Obtener el ID del usuario de los parámetros de la solicitud
        const user = await User.findOne({ _id: userId, deletedAt: null }) // Buscar el usuario por su ID
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' })
        }
        // Devolver solo la información necesaria del usuario (nombre completo, edad, correo electrónico, etc.)
        const userInfo = {
            fullName: user.fullName,
            age: user.age,
            email: user.email,
            // Ver la cantidad de posts que tiene vinculados el usuario
            posts: user.posts.length
        }
        return res.status(200).json(userInfo)
    } catch (error) {
        console.error(error); // Registrar cualquier error en la consola para fines de depuración
        return res.status(500).json({ message: 'Error al obtener información del usuario' })
    }
}

/**
 *  *   put:
 *     summary: Actualiza la información de un usuario por su ID.
 *     description: Actualiza la información de un usuario específico por su ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario.
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
 *               age:
 *                 type: number
 *                 description: Edad del usuario.
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario.
 *     responses:
 *       '200':
 *         description: Información del usuario actualizada correctamente.
 *       '400':
 *         description: No se proporcionaron datos para actualizar.
 *       '403':
 *         description: No tiene permiso para actualizar este usuario.
 *       '404':
 *         description: Usuario no encontrado.
 *       '500':
 *         description: Error al actualizar la información del usuario.
 */

// Función para actualizar la información del usuario
export const updateUserInfo = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId; // Obtener el ID del usuario de los parámetros de la solicitud
        const { fullName, age, email } = req.body; // Datos actualizados del usuario

        // Verificar si el usuario existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar que el usuario está intentando actualizar su propio perfil, si no es el propio, logeado, generador del token, no puede actualizar
        if (userId.toString() !== user._id.toString()) {
            return res.status(403).json({ message: 'No tiene permiso para actualizar este usuario' });
        }

        // Actualizar la información del usuario
        user.fullName = fullName || user.fullName;
        user.age = age || user.age;
        user.email = email || user.email;
        await user.save();

        return res.status(200).json({ message: 'Información del usuario actualizada correctamente' });
    } catch (error) {
        return res.status(500).json({ message: 'Error al actualizar la información del usuario' });
    }
};

/**
 * *   delete:
 *     summary: Elimina un usuario por su ID.
 *     description: Elimina un usuario específico por su ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario.
 *     responses:
 *       '200':
 *         description: Usuario eliminado correctamente.
 *       '403':
 *         description: No tiene permiso para eliminar este usuario.
 *       '404':
 *         description: Usuario no encontrado.
 *       '500':
 *         description: Error al eliminar el usuario.
 */

// Función para eliminar el usuario
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId // Obtener el ID del usuario de los parámetros de la solicitud

        // Verificar si el usuario existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar que el usuario está intentando eliminar su propio perfil
        if (userId !== user._id.toString()) {
            return res.status(403).json({ message: 'No tiene permiso para eliminar este usuario' });
        }

        // Eliminar el usuario
        user.deletedAt = new Date();
        await user.save();
        

        return res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        return res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
};

/**
 *  * /api/user/{userId}/change-password:
 *   put:
 *     summary: Cambia la contraseña de un usuario por su ID.
 *     description: Cambia la contraseña de un usuario específico por su ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 description: Nueva contraseña del usuario.
 *     responses:
 *       '200':
 *         description: Contraseña actualizada correctamente.
 *       '404':
 *         description: Usuario no encontrado.
 *       '500':
 *         description: Error al cambiar la contraseña.
 */

// funcion para cambiar el password del usuario
export const changePassword = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId; // Obtener el ID del usuario de los parámetros de la solicitud
        const { newPassword } = req.body; // Obtener la nueva contraseña del cuerpo de la solicitud

        // Buscar al usuario por su ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Cifrar la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Actualizar la contraseña del usuario en la base de datos
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        return res.status(500).json({ message: 'Error al cambiar la contraseña', error });
    }
};