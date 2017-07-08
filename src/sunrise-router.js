import express from 'express'
import SunburstMapper from './sunburst-mapper'

const app = express.Router()

// I'm keeping this one to just have a coordinate to play with. This way I can
// work on things that need a coordinate without having my system integrated
// w/ Google Maps API
const geolocation = ['37.9252316','-90.7686706']

app.get('/', (req, res) => {
  // - [ ] Convert ZIP and city/state into geo coordinates using Google Maps API
  // - [ ] Get sunrise forecasting data somehow from Sunburst API
  //   - [x] Fake it till you have it
  // - [ ] Recover from errors - if any, and give a proper reason

  const sunburst = new SunburstMapper()

  sunburst.getSunriseForecast()
    .then(payload => res.status(200).json(payload))
    // todo: catch errors
})

module.exports = app
