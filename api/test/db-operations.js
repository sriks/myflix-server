let chai = require('chai')
let expect = require('chai').expect
const utils = require('./utils')
const DB = require('../users/db')

describe('User DB Operations', () => {
    const users = new DB.Users()
    var aUserEmail = utils.generateEmailId() 
    it('should return empty when fetching invalid user', (done) => {
        users.fetchUserWithEmail(utils.generateEmailId())
        .then(userData => {
            expect(userData).to.be.null
            done()
        })
        .catch(err => {
            expect(err).to.be.null
            done()
        })
    })

    it('should add user data', (done) => {
        const userData = new DB.UserData(aUserEmail)
        userData.fullName = 'Indiana Jones'
        users.updateUser(userData).then(userData => {
            expect(userData).not.to.be.null
            done()
        })
        .catch(err => {
            expect(err).to.be.null
            done()
        })
    })
})
