import express from 'express'

import dotenv from 'dotenv'
dotenv.config()

import sunrise from './sunrise-router'

const port = process.env.PORT || 8080
const app  = express()

app.use('/sunrise', sunrise)

app.get('/', (req, res) => res.end('Hello, World!'))

app.listen(port, _ => console.log('Listening on', port))
