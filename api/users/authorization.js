const DB = require('./db.js')
const Ajv = require('ajv')
const ajv = new Ajv({allErrors: true})
const authenticateUserValidationSchema = require('./validations/authorizeUser.json')
const httpStatusCodes = require('http-status-codes')
const jwt = require('jsonwebtoken')

class Authorization {

    constructor(event) {
        this.event = event
    }

    authorize() {
        return new Promise((resolve, reject) => {
            const body = this.event.body
            // Validate request
            if (!ajv.validate(authenticateUserValidationSchema, body)) {
                var reason = ajv.errorsText(ajv.errors)
                reject({
                    statusCode: httpStatusCodes.BAD_REQUEST,
                    reason: reason 
                })
                return
            }
            const email = body.email
            const otpEntry = new DB.OTPEntry(body.otp, email, body.token)
            const dbOp = new DB.OTP()
            const users = new DB.Users()
            dbOp.vaidateOTPEntry(otpEntry)
                .then((entry) => {
                    console.log('deleted entry, checking and creating user ' + JSON.stringify(entry))
                    return users.fetchUserWithEmail(email)
                })
                .then((userData) => {
                    if (userData != null) {
                        return userData
                    } else {
                        const newUser = new DB.UserData(email)
                        return users.updateUser(newUser)
                    }
                })
                .then((userData) => {
                    const payload = { 
                        email: userData.email, 
                        iss: process.env.AWS_ENVIRONMENT+'.deviceworks.myflix'
                     }
                    // Uses default HS256
                    const jwtToken = jwt.sign(payload, process.env.JWT_KEY)
                    return jwtToken
                })
                .then(jwtToken => 
                    resolve({
                        statusCode: httpStatusCodes.OK,
                        result: {
                            accessKey: process.env.MFX_ACCESS_KEY,
                            token: jwtToken
                        }
                    })
                )
                .catch((err) => {
                    console.error('failed with error: '+err)
                    reject({
                        statusCode: httpStatusCodes.NOT_FOUND,
                        reason: err.message
                    })
                })
        })
    }
}

module.exports = Authorization