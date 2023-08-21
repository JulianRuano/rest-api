import { Router } from 'express'
import { MoviesController } from '../controllers/movies.js'

export const moviesRouter = Router()

moviesRouter.get('/', MoviesController.getAll)

moviesRouter.get('/:id', MoviesController.getById)

moviesRouter.post('/', MoviesController.create)

moviesRouter.delete('/:id', MoviesController.delete)

moviesRouter.patch('/:id', MoviesController.update)
