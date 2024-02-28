import { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'
import { TypeUser } from '../types/User.type'

const UserSchema: Schema<TypeUser> = new Schema({
    fullName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    deletedAt: {
        type: Date,
        default: null // es un campo opcional
    }
}, {
    timestamps: true, // Agregar createdAt y updatedAt automáticamente
    versionKey: false // No incluir el campo __v en los documentos
  });


// metodo para cifrar el password
UserSchema.statics.encryptPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10); // aplicar 10 veces el algoritmo de cifrado
    return await bcrypt.hash(password, salt); // cifrar el password
}

UserSchema.statics.comparePassword = async (password: string, receivedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, receivedPassword); // comparar el password
}

const User = model<TypeUser>('User', UserSchema)

export default User








/**
 * {
    "fullName": "Arbey Chica",
    "age": 22,
    "email": "arvey123@example.com",
    "password": "12345"
}
 */

/**
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2NWRmNDM3MTUxMzRlNGNjY2ZmYWIyNzkiLCJpYXQiOjE3MDkxMzI1NzUsImV4cCI6MTcwOTEzNjE3NX0.eUoW0tbXF80gCyySDQsmCk_I5p-aBOGFu36yKMznQCI
 */

/**
 * 
    try {
        const userId = (req as UserRequest).user?.id; // ID del usuario obtenido del token de autenticación
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        // Devolver solo la información necesaria del usuario (nombre completo, edad, correo electrónico, etc.)
        const userInfo = {
            fullName: user.fullName,
            age: user.age,
            email: user.email,
            // ver los posts, es un array, entonces solo mostrar la cantiodad de posts que tiene vinculado/relaionado
            posts: user.posts.length

        };
        return res.status(200).json(userInfo)
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener información del usuario' })
    }
 */