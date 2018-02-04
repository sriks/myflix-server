let chai = require('chai')
let chaiHttp = require('chai-http')
let expect = require('chai').expect
const httpStatusCodes = require('http-status-codes')
const utils = require('./utils')
const url = process.env.TEST_URL

console.log('STAGE '+process.env.STAGE)
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
                'email': 'unittesting@test.com',
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
                'email': 'invalid.emailatattest.com',
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

    describe('/POST /users/authorize', () => {
        const path = '/users/authorize'

        it('it should authorize with valid details', (done) => {
            // Add a test entry befor validation 
            utils
            .addTestOTPEntry()
            .then(body => {
                console.log('testing with simulated entry '+JSON.stringify(body))
                chai.request(url)
                .post(path)
                .set('Content-Type', 'application/json')
                .send(body)
                .end((err, res) => {
                    expect(res).to.have.status(httpStatusCodes.OK)
                    let body = utils.body(res)
                    expect(body, 'all keys').to.include.all.keys('ok', 'result')
                    expect(body.ok).to.be.true
                    let result = body.result
                    expect(result, 'result all keys').to.include.all.keys('accessKey')
                    expect(result.accessKey, 'access key is not empty').to.be.not.empty
                    done()
                })
            })
            .catch(err => {
                expect(err, 'failed to add test otp entry' + err).to.be.null
                done()
            })
        })

        it('it should fail to authorize for not found details', (done) => {
            const body = {
                'email': 'notfoundemail@test.com',
                'token': '80CE4B7C-AAAA-BBBB-CCCC-E7CA8A00D9A0',
                'otp': '000000'
            }
            chai.request(url)
                .post(path)
                .set('Content-Type', 'application/json')
                .send(body)
                .end((err, res) => {
                    expect(res).to.have.status(httpStatusCodes.NOT_FOUND)
                    let body = utils.body(res)
                    expect(body, 'all keys').to.include.all.keys('ok', 'error')
                    expect(body.ok).to.be.false
                    done()
                })
        })

        it('it should return error on invalid request', (done) => {
            const invalidBody = {
                'email': 'invalidemail',
                'token': 'invalidtoken'
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