const helper = require('sendgrid').mail
 
class EmailRequest {
    constructor(to, subject, body) {
        this.to = to
        this.subject = subject
        this.body = body
    }

    send() {
        const fromEmail = new helper.Email('noreply@myflix.app', 'MyFlix')
        const toEmail = new helper.Email(this.to)
        const content = new helper.Content('text/plain', this.body)
        const mail = new helper.Mail(fromEmail, this.subject, toEmail, content)
        const sg = require('sendgrid')(process.env.SENDGRID_API_KEY)
        const request = sg.emptyRequest({
          method: 'POST',
          path: '/v3/mail/send',
          body: mail.toJSON()
        })
        return sg.API(request)
    }
}

module.exports = EmailRequest

