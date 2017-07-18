import request from 'request-promise-native'

const API_BASE_URL = 'https://sunburst.sunsetwx.com/v1'

class SunburstMapper {
  constructor (params) {
    if (typeof params !== 'object') {
      throw new Error('You must pass parameters as key/value pairs object.')
    }

    if (!params.email || !params.password) {
      throw new Error('`email` and `password` parameters are required.')
    }

    this.email = params.email;
    this.password = params.password;
  }

  getToken () {
    return request.post({
      uri: API_BASE_URL + '/login',
      formData: {
        email: this.email,
        password: this.password
      },
      json: true
    })
      .then(body => {
        this.token = body.token
        return this.token
      })
  }

  getSunriseForecast () {
    return this.getSunsetForecast()
  }

  getSunsetForecast () {
    return Promise.reject(new Error())
  }
}

module.exports = SunburstMapper
