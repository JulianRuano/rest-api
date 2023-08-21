import express, { json } from 'express'
import { moviesRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'

const app = express()
app.use(json())
app.disable('x-powered-by')
app.use(corsMiddleware())

// cada vez que se haga una petición a la ruta /movies,
// se ejecutará el código de moviesRouter
app.use('/movies', moviesRouter)

const PORT = process.env.PORT ?? 5001

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT} `)
})

// configuración para que el servidor escuche en una dirección IP específica
// const ipAddress = '192.---.---.---'
// app.listen(desiredPort, ipAddress, () => {
//   console.log(`Servidor escuchando en la dirección: http://${ipAddress}:${desiredPort}`)
// })
