import request from 'request-promise-native'

const API_BASE_URL = 'https://sunburst.sunsetwx.com/v1'

export default class SunburstMapper {
  constructor (params) {
    if (typeof params !== 'object') {
      throw new Error([
        'SunburstMapper requires an object with parameters.',
        "E.g: `new SunburstMapper({",
        "  email: 'john@doe.com',",
        "  password: 'a1b2c3'",
        "})`",
      ].join("\n"))
    }

    if (!params.email || !params.password) {
      throw new Error('Parameters `email` and `password` are required.')
    }

    this.email = params.email;
    this.password = params.password;
  }

  getToken () {
    return request.post({
      uri: API_BASE_URL + '/login',
      form: {
        email: this.email,
        password: this.password
      },
      json: true,
      simple: true
    })
      .then(body => (this.token = body.token) && this.token)
      .catch(error => {
        throw new Error([
          `Something went wrong while requesting the API with these credentials:`,
          `Error: ${error}`
        ].join("\n"))
      })
  }

  predict (params) {
    if (typeof params !== 'object')
      throw new Error([
        'SunburstMapper#predict requires an object with parameters.',
        "E.g: `mySunburstMapperInstance.predict({",
        "  type: 'sunrise',",
        "  coords: '12.34567890,9.8765432',",
        "})`",
      ].join("\n"))

    if (!params.type || !params.coords)
      throw new Error('Parameters `type` and `coords` are required.')

    if (!['sunrise', 'sunset'].includes(params.type))
      throw new Error("Parameters `type` must be either 'sunrise' or 'sunset'.")

    params.limit  = params.limit  || 1
    params.radius = params.radius || 0

    return (
      this.token
        ? Promise.resolve(this.token)
        : this.getToken()
    )
      .then(token => request.get({
        uri: API_BASE_URL + '/quality',
        qs: params,
        auth: {
          bearer: this.token
        },
        json: true,
        simple: true
      }))
      .then(geoJSON => ({
        type: geoJSON.features[0].properties.type,
        quality: geoJSON.features[0].properties.quality,
        quality_percent: geoJSON.features[0].properties.quality_percent,
        recommended_time: geoJSON.features[0].properties.valid_at,
        temperature: geoJSON.features[0].properties.temperature
      }))
  }
}
