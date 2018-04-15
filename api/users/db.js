// Index file for DB operations
//

const OTP       =   require('./db-operations/OTPDBOperations')
const Users     =   require('./db-operations/UsersDBOperations')

module.exports = {
    // OTP
    OTP: OTP.OTPDBOperations,
    OTPEntry: OTP.OTPEntry,

    // Users
    Users: Users.UsersDBOperations,
    UserData: Users.UserData
}

