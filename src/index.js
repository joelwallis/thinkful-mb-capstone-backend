import express from 'express'

const port = process.env.PORT || 8080
const app = express()

app.get('/', (req, res) => res.end('Hello, World!'))

app.listen(port, _ => console.log('Listening on', port))
