import path from 'path'
import request from 'request-promise-native'
import SunburstMapper from '../src/sunburst-mapper'

import chai from 'chai'
import sinon from 'sinon'
const expect = chai.expect

import dotenv from 'dotenv'
// dotenv.config({path: path.join(__dirname, '../.env')})

// Immutable default parameters
const DEFAULT_PARAMS = {}
Object.defineProperties(DEFAULT_PARAMS, {
  email: {value: 'root@localhost.local', writable: false},
  password: {value: '123', writable: false}
})

// Immutable valid parameters (from environment variables - see dotenv module)
const VALID_PARAMS = {}
if (process.env.SUNBURST_ACCOUNT_EMAIL && process.env.SUNBURST_ACCOUNT_PASSWORD) {
  Object.defineProperties(VALID_PARAMS, {
    email: {value: process.env.SUNBURST_ACCOUNT_EMAIL, writable: false},
    password: {value: process.env.SUNBURST_ACCOUNT_PASSWORD, writable: false}
  })
}

describe('SunburstMapper', function () {

  it('is a class', function () {
    expect(typeof SunburstMapper).to.equal('function')
    expect(() => new SunburstMapper()).to.throw(Error)
    expect(function () {
      var sm = new SunburstMapper(DEFAULT_PARAMS)
      expect(sm).to.be.an.instanceof(SunburstMapper)
    }).to.not.throw()
  })

  it('requires a parameter `email`', function () {
    expect(() => new SunburstMapper({password: DEFAULT_PARAMS.password})).to.throw(Error)
    expect(() => new SunburstMapper(DEFAULT_PARAMS)).to.not.throw()
  })

  it('requires a parameter `password`', function () {
    expect(() => new SunburstMapper({email: DEFAULT_PARAMS.email})).to.throw(Error)
    expect(() => new SunburstMapper(DEFAULT_PARAMS)).to.not.throw()
  })

  describe('#getToken', function () {

    beforeEach(() => {
      request.post.restore && request.post.restore()

      sinon.stub(request, 'post').returns(Promise.resolve({
        token: 'abc'
      }))
    })
    afterEach(() => request.post.restore())

    it('gets an auth token (JWT) from Sunburst API', function () {
      return new SunburstMapper(DEFAULT_PARAMS)
        .getToken()
        .then(token => expect(token).to.be.a('string'))
    })

  })

  describe('#predict', function () {

    beforeEach(() => {
      sinon.stub(request, 'post').returns(Promise.resolve({token: 'abc'}))
      sinon.stub(request, 'get').returns(Promise.resolve({
        features: [{
            properties: {
              type: 'Sunrise',
              quality: 'Poor',
              quality_percent: 23.38,
              quality_value: -235.076,
              temperature: 5.94
            }
        }]
      }))
    })
    afterEach(() => {
      request.post.restore()
      request.get.restore()
    })

    it('requires an object with parameters', function () {
      expect(() => new SunburstMapper(DEFAULT_PARAMS).predict()).to.throw(Error)
    })

    it('requires a parameter `type`', function () {
      expect(() => new SunburstMapper(DEFAULT_PARAMS).predict({
        coords: '12.34,56.78'
      })).to.throw(Error)
      expect(() => new SunburstMapper(DEFAULT_PARAMS).predict({
        type: 'sunrise',
        coords: '12.34,56.78'
      })).to.not.throw()
    })

    it('requires a parameter `coords`', function () {
      expect(() => new SunburstMapper(DEFAULT_PARAMS).predict({
        type: 'sunrise'
      })).to.throw(Error)
      expect(() => new SunburstMapper(DEFAULT_PARAMS).predict({
        type: 'sunrise',
        coords: '12.34,56.78'
      })).to.not.throw()
    })

    it("requires either 'sunrise' or 'sunset' as parameter `type`", function () {
      expect(() => new SunburstMapper(DEFAULT_PARAMS).predict({
        type: 'something else',
        coords: '12.34,56.78'
      })).to.throw(Error)
      expect(() => [
        'sunrise',
        'sunset'
      ].forEach(type => new SunburstMapper(DEFAULT_PARAMS).predict({
        type: type,
        coords: '12.34,56.78'
      }))).to.not.throw()
    })

  })

  describe('and the Sunburst API', function () {

    // Tests are run if - and only if there are valid credentials set as
    // env variables (`SUNBURST_ACCOUNT_EMAIL` and `SUNBURST_ACCOUNT_PASSWORD`)
    (function (it) {

      let sm

      it('gets an auth token (JWT) from Sunburst API', function () {
        this.timeout(5000)

        sm = new SunburstMapper(VALID_PARAMS)
        sm.getToken()
          .then(token => expect(token).to.be.a('string'))

        return sm
      })

      it('predicts the sunrise quality', function () {
        this.timeout(5000)

        return sm.predict({
          type: 'sunrise',
          coords: '-77.8600012,40.7933949'
        })
          .then(prediction => {
            expect(prediction).to.be.an('object')
            expect(prediction).to.have.property('type')
            expect(prediction).to.have.property('quality')
            expect(prediction).to.have.property('quality_percent')
            expect(prediction).to.have.property('temperature')
            expect(prediction.type).to.be.a('string')
            expect(prediction.quality).to.be.a('string')
            expect(prediction.quality_percent).to.be.a('number')
            expect(prediction.temperature).to.be.a('number')
          })
      })

      it('predicts the sunset quality', function () {
        this.timeout(5000)

        return sm.predict({
          type: 'sunset',
          coords: '-77.8600012,40.7933949'
        })
          .then(prediction => {
            expect(prediction).to.be.an('object')
            expect(prediction).to.have.property('type')
            expect(prediction).to.have.property('quality')
            expect(prediction).to.have.property('quality_percent')
            expect(prediction).to.have.property('temperature')
            expect(prediction.type).to.be.a('string')
            expect(prediction.quality).to.be.a('string')
            expect(prediction.quality_percent).to.be.a('number')
            expect(prediction.temperature).to.be.a('number')
          })
      })

    })(process.env.SUNBURST_ACCOUNT_EMAIL && process.env.SUNBURST_ACCOUNT_PASSWORD ? it : xit)

  })

})
