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
                    resolve(otpEntry)
                }
            })
        })
    }

    // If valid, returns the db item. Else an error. 
    vaidateOTPEntry(otpEntry) {
        return new Promise((resolve, reject) => {
            const docClient = new AWS.DynamoDB.DocumentClient()
            // Try deleting item matching all attirbutes. Deleted item is returned. 
            var params = {
                TableName : this.tableName,
                Key: {
                    "token": otpEntry.token
                },
                ConditionExpression:"otp = :otp AND email = :email",
                ExpressionAttributeValues: {
                    ":otp": otpEntry.otp,
                    ":email": otpEntry.email
                },
                ReturnValues:"ALL_OLD"
            }
            docClient.delete(params, function(err, data) {
                if (err) {
                    console.error('Unable to delete item. Error JSON:', JSON.stringify(err, null, 2))
                    reject(new Error('Invalid otp or no otp found'))
                } else {
                    console.log('success')
                    resolve(data.Attributes)
                }
            })
        })
    }
}

module.exports = {
    DBOperations: DBOperations,
    OTPEntry: OTPEntry
}

