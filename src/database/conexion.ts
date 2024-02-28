import mongoose from "mongoose";

mongoose.connect( process.env.DATABASE_URL || "mongodb://localhost/posts",{
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useFindAndModify: true,
    // useCreateIndex: true
})
    .then(() => console.log("Conectado a la base de datos"))
    .catch((error) => {
            console.log("Error al conectar a la base de datos", error)
            process.exit(1) // terminar la aplicacion si hay un error
        })

