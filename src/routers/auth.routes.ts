import { Router } from "express"

import * as authRoutes from "../controllers/Auth.controllers"
import { authenticateUser } from "../middlewares/Auth.middleware"
import * as Check from "../middlewares/CheckSignup.middleware"

const router = Router()

// definir las rutas de autenticacion


// definir las rutas de los posts
// ruta para loguear un usuario
router.post('/login', authRoutes.loginUser)
// ruta para registrar un usuario
router.post('/register', Check.ChechUsernameExists , Check.ChechEmailExists , authRoutes.registerUser)
// ruta para logout
router.post('/logout', authenticateUser, authRoutes.Logout)
// ruta para refresh token
router.get('/refresh_token', authenticateUser, authRoutes.refreshToken)

export default router