import SunburstMapper from '../src/sunburst-mapper'

import chai from 'chai'
import sinon from 'sinon'
import request from 'request-promise-native'
const expect = chai.expect

const DEFAULT_EMAIL    = 'root@localhost.local'
const DEFAULT_PASSWORD = '123'
const DEFAULT_PARAMS   = {email: DEFAULT_EMAIL, password: DEFAULT_PASSWORD}

describe('SunburstMapper', function () {

  it('is a class', function () {
    expect(typeof SunburstMapper).to.equal('function')
    expect(() => new SunburstMapper()).to.throw()
    expect(function () {
      var sm = new SunburstMapper(DEFAULT_PARAMS)
      expect(sm).to.be.an.instanceof(SunburstMapper)
    }).to.not.throw()
  })

  it('requires a parameter `email`', function () {
    expect(() => new SunburstMapper({password: DEFAULT_PASSWORD})).to.throw()
    expect(() => new SunburstMapper(DEFAULT_PARAMS)).to.not.throw()
  })

  it('requires a parameter `password`', function () {
    expect(() => new SunburstMapper({email: DEFAULT_EMAIL})).to.throw()
    expect(() => new SunburstMapper(DEFAULT_PARAMS)).to.not.throw()
  })

  describe('#getToken', function () {

    beforeEach(() => sinon.stub(request, 'post').returns(Promise.resolve({
      token: 'abc'
    })))
    afterEach(() => request.post.restore && request.post.restore())

    it('gets an auth token (JWT) from Sunburst API', function () {
      const sm = new SunburstMapper(DEFAULT_PARAMS)
      sm.getToken()
      request.post.called
      const promise = sm.getToken()
      return promise
        .then(token => expect(token).to.be.a('string'))
        .catch(console.error)
    })

    it('throws an error when something goes wrong', function () {
      request.post.restore()
      sinon.stub(request, 'post').returns(Promise.reject(new Error()))
      const spy = sinon.spy()
      const sm = new SunburstMapper(DEFAULT_PARAMS)
      const promise = sm.getToken()
      return promise
        .catch(spy)
        .then(() => spy.called)
    })

  })

})
