import { MovieModel } from '../models/movie'
import { validateMovie, validatePartialMovie } from '../schemas/movies'

export class MoviesController {
  static async getAll (req, res) {
    const { genre } = req.query
    const movies = await MovieModel.getAll({ genre })
    // que es lo que renderiza
    res.json(movies)
  }

  static async getById (req, res) {
    const { id } = req.params
    const movie = await MovieModel.getById({ id })
    if (movie) return res.json({ movie })
    res.status(404).json({ message: 'Movie not found' })
  }

  static async create (req, res) {
    const result = validateMovie(req.body)
    if (!result.success) {
      return res.status(400).json({ errors: JSON.parse(result.error.message) })
    }
    const { title, releaseDate, length, actors, genre } = result.data
    const movie = await MovieModel.create({ title, releaseDate, length, actors, genre })
    res.status(201).json(movie)
  }

  static async delete (req, res) {
    const { id } = req.params

    const result = await MovieModel.delete({ id })

    if (!result) {
      return res.status(404).json({ message: 'Movie not found' })
    }

    return res.json({ message: 'Movie deleted' })
  }

  static async update (req, res) {
    const result = validatePartialMovie(req.body)

    if (!result.success) {
      return res.status(400).json({ errors: JSON.parse(result.error.message) })
    }

    const { id } = req.params
    const updatedMovie = await MovieModel.update({ id, ...result.data })

    return res.json(updatedMovie)
  }
}
