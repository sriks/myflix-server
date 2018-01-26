'use strict'
const AWS = require('aws-sdk')
const ApiGatewayResponse = require('lambda-api-gateway-response')
const Users = require('./users/users.js')
AWS.config.update({region: process.env.REGION});

var didFinish = function(error, result, callback) {
  console.log('errr:'+error)
  let body
  let statusCode
  if (error) {
      statusCode = 400
      body = {
        ok: false,
        error: JSON.stringify(error)
      }
  } else {
      statusCode = 200
      body = {
        ok: true,
        result: result
      }
  }

  console.log(JSON.stringify(body))
  new ApiGatewayResponse(callback)
      .status(statusCode)
      .headers({
        'Content-Type': 'application/json',
        'access-control-allow-origin': '*'
      })
      .body(body)
      .send();
}
    
var handleCompletion = function(aPromise, callback) {
    aPromise
      .then(response => {
        didFinish(null, response, callback)
      })
      .catch(err => {
        console.log('failed with err'+err)
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

module.exports.authenticateUser = (event, context, callback) => {
    event = convertEventBodyToJSON(event)
    console.log('input event:'+JSON.stringify(event))
    handleCompletion(Users.authenticate(event), callback)
}
