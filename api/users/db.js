// Index file for DB operations
//

const OTP = require('./db-operations/OTPDBOperations.js')

module.exports = {
    OTP: OTP.OTPDBOperations,
    OTPEntry: OTP.OTPEntry
}

