'use strict'
const AWS = require('aws-sdk')
const Users = require('./users/users.js')
AWS.config.update({region: process.env.REGION});

var didFinish = function(error, result, callback) {
    let body
    let statusCode
    if (error) {
        statusCode = error.statusCode
        body = {
          ok: false,
          error: {
            reason: error.reason
          }
        }
    } else {
        statusCode = result.statusCode
        body = {
          ok: true,
          result: result.result
        }
    }

    const apiResponse = {
      statusCode: statusCode,
      headers: {
        "Content-Type": "application/json",
        "access-control-allow-origin": "*"
      },
      body: JSON.stringify(body)
    }

    console.log('finalresponse:'+  JSON.stringify(apiResponse))
    callback(null, apiResponse)
}
    
var handleCompletion = function(aPromise, callback) {
    aPromise
      .then(response => {
        didFinish(null, response, callback)
      })
      .catch(err => {
        didFinish(err, null, callback)
      })
}

var convertEventBodyToJSON = function(event) {
    const theBody = event.body
    if (typeof(theBody) == "string") {
        event.body = JSON.parse(theBody)
    } 
    return event
}

const authenticateUser = function(event, context, callback) {
    event = convertEventBodyToJSON(event)
    console.log('input event:'+JSON.stringify(event))
    handleCompletion(Users.authenticate(event), callback)
}

const authorizeUser = function(event, context, callback) {
    event = convertEventBodyToJSON(event)
    console.log('input event:'+JSON.stringify(event))
    handleCompletion(Users.authorize(event), callback)
}

module.exports = {
    authenticateUser: authenticateUser,
    authorizeUser: authorizeUser
}
