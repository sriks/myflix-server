const Authentication = require('./authentication')
const Authorization = require('./authorization')

const authenticate = function(event) {
    const auth = new Authentication(event)
    return auth.authenticate()
}

const authorize = function(event) {
    const authorization = new Authorization(event)
    return authorization.authorize()
}

module.exports = { 
    authenticate: authenticate,
    authorize: authorize
}