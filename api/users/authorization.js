const DB = require('./db.js')
const Ajv = require('ajv')
const ajv = new Ajv({allErrors: true})
const authenticateUserValidationSchema = require('./validations/authorizeUser.json')
const httpStatusCodes = require('http-status-codes')

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
            const otpEntry = new DB.OTPEntry(body.otp, body.email, body.token)
            const dbOp = new DB.DBOperations()
            dbOp.vaidateOTPEntry(otpEntry)
                .then((entry) => {
                    console.log('deleted entry:' + JSON.stringify(entry))
                    resolve({
                        statusCode: httpStatusCodes.OK,
                        result: {
                            accessKey: process.env.MFX_ACCESS_KEY
                        }
                    })
                })
                .catch(err => {
                    reject({
                        statusCode: httpStatusCodes.NOT_FOUND,
                        reason: err.message
                    })
                })
        })
    }
}

module.exports = Authorization