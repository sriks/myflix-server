// Performs DB operations
//
const AWS = require("aws-sdk");

class OTPEntry {
    constructor(otp, email, token) {
        this.otp = otp
        this.email = email
        this.token = token
    }
}

class DBOperations {
    constructor() {
        AWS.config.update({
            endpoint: process.env.AWS_DYNAMODB_ENDPOINT
        })
    }

    get tableName() {
        return process.env.AWS_ENVIRONMENT + '.myflix.otp'
    }

    addOTPEntry(otpEntry) {
        return new Promise((resolve, reject)=> {
            const today = new Date();
            const ttl = today.setHours(today.getHours() + 4);
            const docClient = new AWS.DynamoDB.DocumentClient();
            const params = {
                TableName: this.tableName,
                Item: {
                    'otp': otpEntry.otp,
                    'email': otpEntry.email,
                    'token': otpEntry.token,
                    'ttl': ttl
                }
            };
            console.log('adding otp entry...')
            docClient.put(params, function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve()
                }
            })
        })
    }
}

module.exports = {
    DBOperations: DBOperations,
    OTPEntry: OTPEntry
}

