class SunburstMapper {
  constructor (api_key) {
    this.api_key = api_key;
  }

  getSunriseForecast() {
    return Promise.resolve({
      quality: Math.floor(Math.random() * 101),
      scheduledFor: getRandomSchedule(true)
    })
  }

  getSunsetForecast() {
    return Promise.resolve({
      quality: Math.floor(Math.random() * 101),
      scheduledFor: getRandomSchedule()
    })
  }
}

function getRandomSchedule (isSunrise) {
  const schedule = new Date()
  schedule.setHours(isSunrise ? 5 : 17)
  schedule.setMinutes(Math.floor(Math.random() * 31) + 15) // random 15-45 number
  return schedule
}

module.exports = SunburstMapper
