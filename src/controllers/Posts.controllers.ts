import { Request, Response } from 'express'
import Post from '../models/Posts.model'
import User from '../models/User.model'

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Crea un nuevo post.
 *     description: Crea un nuevo post con los datos proporcionados en el cuerpo de la solicitud.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título del post.
 *               content:
 *                 type: string
 *                 description: Contenido del post.
 *               user:
 *                 type: string
 *                 description: ID del usuario que crea el post.
 *     responses:
 *       '201':
 *         description: Post creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       '500':
 *         description: Error al crear el post.
 */

// funcion para crear un post, usando TypeScript
export const createPost = async (req: Request, res: Response) => {
    try{
        const { title, content, user } = req.body
        const newPost = new Post({ title, content, user })
        await newPost.save()

        // actualizar el array de posts del user
        const userToUpdate = await User.findById(user)
        if(userToUpdate){
            userToUpdate.posts.push(newPost._id) // agregar el id del post al array de posts del usuario
            await userToUpdate.save() // guardar el usuario
        } else {
            throw new Error("No se encontró el usuario")
        }

        res.status(201).json(newPost)
    } catch (error) {
        res.status(500).json({ message: "Error al crear el post" })
    }
}

/**
 * *   get:
 *     summary: Obtiene todos los posts.
 *     description: Obtiene todos los posts existentes en la base de datos.
 *     responses:
 *       '200':
 *         description: Posts obtenidos exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       '404':
 *         description: No hay posts en la base de datos.
 *       '500':
 *         description: Error al obtener los posts.
 */

// funcion para obtener todos los posts
export const getPosts = async (_req: Request, res: Response) => {
    try {
        const posts = await Post.find({ deletedAt: null }).populate('user', 'username') // populate para traer el username del usuario -> o sea, solo traer los post que le pertenecen a un usuario

        if(posts.length === 0) return res.status(404).json({ message: "No hay posts" })

        return res.status(200).json(posts)
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener los posts" })
    }
}

/**
 *  * /api/posts/{id}:
 *   get:
 *     summary: Obtiene un post por su ID.
 *     description: Obtiene un post específico según el ID proporcionado en la URL.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del post a obtener.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Post obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       '500':
 *         description: Error al obtener el post.
 */

// fucion para obtener un post por su id
export const getPostById = async (req: Request, res: Response) => {
    try {
        const postID = req.params.id
        const post = await Post.findOne({ _id: postID, deletedAt: null }).populate('user', 'username') // trae el post, si es del usuario, trae el username
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el post" })
    }
}

/**
 *  *   put:
 *     summary: Actualiza un post por su ID.
 *     description: Actualiza un post específico según el ID proporcionado en la URL.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del post a actualizar.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Nuevo título del post.
 *               content:
 *                 type: string
 *                 description: Nuevo contenido del post.
 *     responses:
 *       '200':
 *         description: Post actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       '404':
 *         description: Post no encontrado.
 *       '500':
 *         description: Error al actualizar el post.
 */

// funcion para actualizar un post
export const updatePost = async (req: Request, res: Response) => {
    try {
        const postId = req.params.id;
        const { title, content } = req.body;
        const updatedPost = await Post.findByIdAndUpdate(postId, { title, content, updatedAt: new Date() }, { new: true });
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post no encontrado' });
        }
        return res.status(200).json(updatedPost);
    } catch (error) {
        return res.status(500).json({ message: `Error al actualizar el post: ${error}` });
    }
}

/**
 *  *   delete:
 *     summary: Elimina un post por su ID.
 *     description: Elimina un post específico según el ID proporcionado en la URL.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del post a eliminar.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Post eliminado correctamente.
 *       '404':
 *         description: No se encontró el post.
 *       '500':
 *         description: Error al eliminar el post.
 */

// funcion para eliminar un post
export const deletePost = async (req: Request, res: Response) => {
    try {
        const postID = req.params.id
        const post = await Post.findById(postID)
        if(!post) {
            return res.status(404).json({ message: "No se encontró el post" })
        }
        post.deletedAt = new Date()
        await post.save()
        return res.status(200).json({ message: "Post eliminado correctamente" })
    } catch (error) {
        return res.status(500).json({ message: "Error al eliminar el post" })
    }
}

/**
 *  * /api/posts/{id}/like:
 *   put:
 *     summary: Añade un like a un post por su ID.
 *     description: Añade un like a un post específico según el ID proporcionado en la URL.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del post al que se añadirá el like.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Like agregado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de éxito.
 *                 likes:
 *                   type: number
 *                   description: Nuevo número de likes del post.
 *       '404':
 *         description: Post no encontrado.
 *       '500':
 *         description: Error al agregar like al post.
 */

// funcion para dar like a un post
export const likePost = async (req: Request, res: Response) => {
    try {
        const postID = req.params.id
        // buscar el post por su id, que sea del usuario que está logueado
        const post = await Post.findById(postID).populate('user', 'username')

        // Si el post no existe
        if(!post) {
            return res.status(404).json({ message: "No se encontró el post" })
        }

        // incrementar el like de uno en uno
        post.likes++

        // guardar el post con el nuevo like
        await post.save()

        return res.status(200).json({
            message: "Like agregado correctamente",
            likes: post.likes
        })
    } catch (error) {
        return res.status(500).json({ message: `Error al agregar like al post: ${error}` })
    }
}