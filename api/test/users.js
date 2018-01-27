let chai = require('chai')
let chaiHttp = require('chai-http')
let expect = require('chai').expect
const httpStatusCodes = require('http-status-codes')
const utils = require('./utils')
const url = process.env.TEST_URL

chai.use(chaiHttp) // http://chaijs.com/api/bdd/
describe('Users', () => {
    beforeEach((done) => { 
        console.log('testing '+url)
        done()
    })

    describe('/POST /users/authenticate', () => {
        const path = '/users/authenticate'
        it('it should authenticate an user email', (done) => {
            const body = {
                'email': 'sriks6504@gmail.com',
                'token': '80CE4B7C-5F64-4F23-AABD-E7CA8A00D9A0'
            }
            chai.request(url)
                .post(path)
                .set('Content-Type', 'application/json')
                .send(body)
                .end((err, res) => {
                    expect(res).to.have.status(httpStatusCodes.CREATED)
                    let body = utils.body(res)
                    expect(body, 'all keys').to.include.all.keys('ok', 'result')
                    expect(body.ok).to.be.true
                    done()
                })
        })

        it('it should return error on invalid request paramaters', (done) => {
            const invalidBody = {
                'email': 'invalid.emailatgmail.com',
                'token': '-80CE4B7C-5F64-4F23-AABD-E7CA8A00D9A0'
            }

            chai.request(url)
                .post(path)
                .set('Content-Type', 'application/json')
                .send(invalidBody)
                .end((err, res) => {
                    expect(res).to.have.status(httpStatusCodes.BAD_REQUEST)
                    let body = utils.body(res)
                    expect(body, 'all keys').to.include.all.keys('ok', 'error')
                    expect(body.ok).to.be.false
                    done()
                })
        })
    })
})