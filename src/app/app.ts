import Express from "express"
import morgan from "morgan"

// importar las rutas de posts
import PostRoutes from "../routers/Post.routes"
import AuthRoutes from "../routers/auth.routes"
import UserRoutes from "../routers/User.routes"

import swaggerSpec from '../../swaggerConfig'
import swaggerUi from 'swagger-ui-express'

const app = Express()

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))


// permitir que o express reciba json
app.use(Express.json())

// usar morgan para ver por consola las peticiones HTTP
app.use(morgan("dev"))

// ruta principal
app.get("/", (_req, res) => {
    res.send("Debe iniciar sesión o registrarse para ver el contenido de la aplicación \n dirijase a /api/auth/login o /api/auth/register para iniciar sesión o registrarse")
})

// rutas
// AuthRoutes
app.use('/api/auth', AuthRoutes)
// PostRoutes
app.use('/api/posts', PostRoutes)
// UserRoutes
app.use('/api/user', UserRoutes)

export default app