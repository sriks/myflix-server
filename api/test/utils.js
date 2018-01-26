// Parses body from proxy reponse structure.
const body = function(response) {
    // body is a string type in response
    let resJSON = JSON.parse(response.text)
    let body = JSON.parse(resJSON.body)
    return body
}

module.exports = {
    body: body
}