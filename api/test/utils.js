// Parses body from proxy reponse structure.
const body = function(response) {
    // body is a string type in response
    // console.log('response:'+JSON.stringify(response))
    let body = JSON.parse(response.text)
    return body
}

module.exports = {
    body: body
}