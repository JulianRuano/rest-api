// import movies from './movies.json'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
export const readJson = (path) => require(path)
