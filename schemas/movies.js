import z from 'zod'

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'El título debe ser un string',
    required_error: 'El título es requerido'
  }),
  year: z.number().int().min(1888).max(2024),
  director: z.string(),
  duration: z.number().int().min(1).max(500),
  rate: z.number().min(1).max(10).optional(),
  poster: z.string().url({
    message: 'El poster debe ser una URL válida'
  }).optional(),
  genre: z.array(
    z.enum(['Action', 'Drama', 'Crime', 'Adventure', 'Sci-Fi', 'Romance', 'Animation', 'Biography', 'Comedy']),
    {
      required_error: 'El género es requerido',
      invalid_element_error: 'El género no es válido'
    }
  )
})

export function validateMovie (object) {
  // safeParse devuelve un objeto con dos propiedades: success y data
  return movieSchema.safeParse(object)
}

export function validatePartialMovie (object) {
  // partial permite que el objeto no tenga todas las propiedades
  return movieSchema.partial().safeParse(object)
}
