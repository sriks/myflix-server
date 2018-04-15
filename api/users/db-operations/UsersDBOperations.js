// Performs DB operations on OTP table
//
const AWS = require('aws-sdk');
const _ = require('underscore')

class UserData {
    constructor(email) {
        this.email = email
        this.fullName = undefined
        this.updatedAt = undefined
    }
}

class UsersDBOperations {
    constructor() {
        AWS.config.update({
            endpoint: process.env.AWS_DYNAMODB_ENDPOINT
        })
    }

    get tableName() {
        return process.env.AWS_ENVIRONMENT + '.myflix.users'
    }

    _userDataFromDynamoItem(item) {
        if (item === undefined) {
            return null
        } else {
            var userData = new UserData(item.email)
            userData.updatedAt = item.updatedAt
            return userData
        }
    }

    _dynamoItemFromUserData(userData) {
        return _.mapObject(userData, function(val, key) {
            return val
        })
    }

    fetchUserWithEmail(email) {
        const self = this 
        return new Promise((resolve, reject) => {
            var params = {
                TableName : this.tableName,
                Key: {
                  'email': email
                }
              };
            const docClient = new AWS.DynamoDB.DocumentClient();
            docClient.get(params, function(err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(self._userDataFromDynamoItem(data.Item))
                }
            });
        })
    }

    updateUser(userData) {
        const self = this
        return new Promise((resolve, reject) => {
            const item = this._dynamoItemFromUserData(userData)
            console.log('item is '+ JSON.stringify(item))
            item['updatedAt'] = _.now()
            const docClient = new AWS.DynamoDB.DocumentClient();
            const params = {
                TableName: this.tableName,
                Item: item,
            };
            docClient.put(params, function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(self._userDataFromDynamoItem(item))
                }
            })
        })
    }
}

module.exports = {
    UserData: UserData, 
    UsersDBOperations: UsersDBOperations
}