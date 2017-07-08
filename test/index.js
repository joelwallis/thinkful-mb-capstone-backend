const chai     = require('chai')
const expect   = chai.expect
const chaiHttp = require('chai-http')

chai.use(chaiHttp)

describe('Sunset API', function () {
  it('runs on port 8080', function (done) {
    chai.request('http://localhost:8080')
      .get('/')
      .end(function (err, res) {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        done()
      })
  })
})
