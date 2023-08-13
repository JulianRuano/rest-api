const express = require('express')
const app = express()
const crypto = require('node:crypto')
const movies = require('./movies.json')
const cors = require('cors')
const { validateMovie, validatePartialMovie } = require('./shemas/movies')

app.use(express.json())
app.disable('x-powered-by')
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:8080',
      'http://localhost:5001',
      'https://movies.com'
    ]
    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }

}))

app.get('/', (req, res) => {
  res.json({ message: 'Hello World' })
})

app.get('/movies', (req, res) => {
  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter(
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    )
    return res.json({ movies: filteredMovies })
  }
  res.json(movies)
})

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)
  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }
  movies.splice(movieIndex, 1)
  res.json({ message: 'Movie deleted' })
})

app.get('/movies/:id', (req, res) => {
  const { id } = req.params // sirve para obtener los parámetros de la URL
  const movie = movies.find(movie => movie.id === id)
  if (movie) return res.json({ movie })
  res.status(404).json({ message: 'Movie not found' })
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)

  if (!result.success) {
    // 400 Bad Request - La solicitud contiene sintaxis errónea y no debería repetirse
    // 422 Unprocessable Entity - La solicitud está bien formada pero fue imposible seguirla debido a errores semánticos
    return res.status(400).json({ errors: result.error })
  }

  const newMovie = {
    id: crypto.randomUUID(), // genera un id aleatorio
    ...result.data
  }

  movies.push(newMovie)
  res.status(201).json({ movie: newMovie })
})

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body)

  if (!result.success) {
    return res.status(400).json({ errors: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  const updatedMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  movies[movieIndex] = updatedMovie

  return res.json(updatedMovie)
})

const PORT = process.env.PORT ?? 5001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// configuración para que el servidor escuche en una dirección IP específica
// const ipAddress = '192.---.---.---'
// app.listen(desiredPort, ipAddress, () => {
//   console.log(`Servidor escuchando en la dirección: http://${ipAddress}:${desiredPort}`)
// })
