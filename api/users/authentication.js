var shortid = require('shortid')
var OTP = require('otp')
var DB = require('./db.js')
var EmailRequest = require('./emailRequest')
var Ajv = require('ajv')
var ajv = new Ajv({allErrors: true})
const authenticateUserValidationSchema = require('./validations/authenticateUser.json')

class Authentication {

    constructor(event) {
        this.event = event
    }

    sendVerification(otpCode) {
        const toEmail = this.email
        const subject = 'Confirm your email address'
        const body = 'Hi there, \nTo proceed with login, please enter the verification code ' + otpCode + ' in the app.'
        const emailReq = new EmailRequest(toEmail, subject, body)
        return emailReq.send()
    }

    addOTP() {
        return new Promise((resolve, reject) => {
            const otpCode = OTP().totp();
            const otpEntry = new DB.OTPEntry(otpCode, this.email, this.token)
            const dbOp = new DB.DBOperations()
            dbOp.addOTPEntry(otpEntry)
            .then(() => {
                resolve(otpCode)
            })
            .catch(err => {
                reject(err)
            })
        })
    }

    authenticate() {
        // Create an otp and add to DB, then send across email verification.
        return new Promise((resolve, reject) => {
            const body = this.event.body
            // Validate request
            if (ajv.validate(authenticateUserValidationSchema, body)) {
                this.email = body.email
                this.token = body.token                
            } else {
                console.log('validation error')
                reject(ajv.errorsText(ajv.errors))
                return
            }

            this.addOTP()
                .then(otp => {
                    console.log('addOTP ... ' + otp)
                    return this.sendVerification(otp)
                })
                .then(result => {
                    console.log('sendVerification ... ok')
                    resolve({})
                })
                .catch(err => {
                    console.error(err)
                    reject(err)
                })
        })    
    }
}

module.exports = Authentication

