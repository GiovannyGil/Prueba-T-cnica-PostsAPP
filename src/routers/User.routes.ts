import { Router } from "express"
import * as UserController from "../controllers/User.controllers"
import { authenticateUser } from "../middlewares/Auth.middleware"


const router = Router()

// ruta para obtener todos los usuario
router.get('/', authenticateUser, UserController.getUsers)
// ruta para obtener la informacion del usuario
router.get('/:userId', authenticateUser, UserController.getUserInfo)
// ruta para actualizar la informacion del usuario
router.put('/:userId', authenticateUser, UserController.updateUserInfo)
// ruta para eliminar el usuario
router.delete('/:userId', authenticateUser, UserController.deleteUser)
// ruta para funcion cambiar la contraseña
router.post('/:userId/changePassword', UserController.changePassword)

export default router