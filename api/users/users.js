const Authentication = require('./authentication')

const authenticate = function(event) {
    const auth = new Authentication(event)
    return auth.authenticate()
}

module.exports = { 
    authenticate: authenticate
}