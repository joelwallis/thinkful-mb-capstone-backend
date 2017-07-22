import express from 'express'
import prediction from './prediction-router'

import dotenv from 'dotenv'
dotenv.config()

const port = process.env.PORT || 8080
const app  = express()

app.get('/', (req, res) => res.end('Welcome to the Sunset API! 😎 🌇'))

app.use('/predict', prediction)

app.listen(port, _ => console.log('Listening on', port))
