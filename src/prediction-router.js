import express from 'express'
import GoogleMaps from '@google/maps'
import SunburstMapper from './sunburst-mapper'
import path from 'path'

import dotenv from 'dotenv'
dotenv.config({path: path.join(__dirname, '../.env')})

const app = express.Router()
const maps = GoogleMaps.createClient({
  key: process.env.GOOGLE_MAPS_API_KEY,
  Promise
})
const sunburst = new SunburstMapper({
  email: process.env.SUNBURST_ACCOUNT_EMAIL,
  password: process.env.SUNBURST_ACCOUNT_PASSWORD
})

app.get('/', (req, res) => {
  (
    req.query.coords && req.query.coords.match(/-?\d+(.\d*),-?\d+(.\d*)/) !== null
      ? Promise.resolve(req.query.coords)
      : maps.geocode({address: req.query.address})
        .asPromise()
        .then(payload => `${payload.json.results[0].geometry.location.lng},${payload.json.results[0].geometry.location.lat}`)
        .catch(err => res.status(400).json({
          error: true,
          services: 'google-maps',
          message: err.toString()
        }).end())
  )
    .then(coords => {
      return sunburst.predict({
        type: req.query.type,
        coords: coords
      })
    })
    .then(prediction => res.status(200).json({
      type: typeof prediction,
      prediction
    }).end())
    .catch(err => res.status(400).json({
      error: true,
      service: 'sunburst',
      message: err.toString()
    }))
})

export default app
