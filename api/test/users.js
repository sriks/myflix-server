let chai = require('chai')
let chaiHttp = require('chai-http')
let expect = require('chai').expect
var mock = require('aws-lambda-test-utils').mockEventCreator
const utils = require('./utils')
const url = process.env.TEST_URL

// http://chaijs.com/api/bdd/
chai.use(chaiHttp)
describe('Users', () => {
    beforeEach((done) => { 
        console.log('testing '+url)
        done()
    })

    describe('/POST /users/authenticate', () => {
        const path = '/users/authenticate'
        it('it should authenticate an user email', (done) => {
            let event = mock.createAPIGatewayEvent({
                body: {
                    'email': 'sriks6504@gmail.com',
                    'token': '80CE4B7C-5F64-4F23-AABD-E7CA8A00D9A0'
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            chai.request(url)
                .post(path)
                .set('Content-Type', 'application/json')
                .send(event)
                .end((err, res) => {
                    console.log(JSON.stringify(res))
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    let body = utils.body(res)
                    expect(body, 'all keys').to.include.all.keys('ok', 'result')
                    expect(body.ok).to.be.true
                    done()
                })
        })

        it('it should error on invalid request paramaters', (done) => {
            let invalidEvent = mock.createAPIGatewayEvent({
                body: {
                    'email': 'invalid.emailatgmail.com',
                    'token': '***80CE4B7C-5F64-4F23-AABD-E7CA8A00D9A0'
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            chai.request(url)
                .post(path)
                .set('Content-Type', 'application/json')
                .send(invalidEvent)
                .end((err, res) => {
                    console.log(JSON.stringify(res))
                    expect(err).to.be.null
                    let body = utils.body(res)
                    expect(body, 'all keys').to.include.all.keys('ok', 'error')
                    expect(body.ok).to.be.false
                    done()
                })
        })
    })
})