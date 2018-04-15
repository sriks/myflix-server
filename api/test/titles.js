let chai = require('chai')
let chaiHttp = require('chai-http')
let expect = require('chai').expect
const httpStatusCodes = require('http-status-codes')
const utils = require('./utils')
const url = process.env.TEST_URL

console.log('STAGE '+process.env.STAGE)
chai.use(chaiHttp) // http://chaijs.com/api/bdd/

// describe('Titles', () => {
//     beforeEach((done) => { 
//         console.log('testing '+url)
//         done()
//     })

//     describe('POST /titles', () => {
//         it('it should add a title', (done) => {
//             const body = {
//                 'userId': '<our test userId>',
//                 'titleId': utils.generateTitleId,
//                 'title': 'God father',
//             }

//             chai.request(url)
//                 .post(path)
//                 .set('Content-Type', 'application/json')
//                 .send(body)
//                 .end((err, res) => {
//                     expect(res).to.have.status(httpStatusCodes.CREATED)
//                     let body = utils.body(res)
//                     expect(body, 'all keys').to.include.all.keys('ok', 'result')
//                     expect(body.ok).to.be.true
//                     done()
//                 })            
//         })
//     })
// })