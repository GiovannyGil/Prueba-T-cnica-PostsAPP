import { Router } from "express"

import * as PostController from "../controllers/Posts.controllers"
import { authenticateUser } from "../middlewares/Auth.middleware"


const router = Router()

// definir las rutas de los posts
// ruta ára obtener todos los posts
router.get('/', authenticateUser, PostController.getPosts)
// ruta para obtener un post por su id
router.get('/:id', authenticateUser, PostController.getPostById)
// ruta para crear un post
router.post('/', authenticateUser, PostController.createPost)
// ruta para actualizar un post
router.put('/:id', authenticateUser, PostController.updatePost)
// ruta para eliminar un post
router.delete('/:id', authenticateUser, PostController.deletePost)
// ruta pa la ruta de likes
router.post('/:id/like', authenticateUser, PostController.likePost)



export default router