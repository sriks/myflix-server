const DB = require('../users/db')
const shortid = require('shortid')
const OTP = require('otp')
const uuidv1 = require('uuid/v1')
const AWS = require('aws-sdk')
// Load target environment variables as expected by staging env.
const envJson = require('../env.json')[process.env.STAGE]
Object.entries(envJson).forEach(([key, val]) => {
    process.env[key] = val
});

// Configure AWS
AWS.config.update({region: process.env.REGION})

// Parses body from proxy reponse structure.
const body = function(response) {
    // body is a string type in response
    let body = JSON.parse(response.text)
    return body
}

const addTestOTPEntry = function() {
    const otpCode = OTP().totp();
    const otpEntry = new DB.OTPEntry(otpCode, 'testentry@test.com', uuidv1())
    const dbOp = new DB.DBOperations()
    return dbOp.addOTPEntry(otpEntry)
}

const generateTitleId = function() {
    return uuidv1()
}

module.exports = {
    body: body,
    addTestOTPEntry: addTestOTPEntry,
    generateTitleId: generateTitleId
}