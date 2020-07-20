const Mail = use('Mail')


class WelcomeMail {

    async send (user) {
        try {
            await Mail.send('emails.welcome', user.toJSON(), (message) => {
                message
                    .to(user.email_default)
                    .from('info@cherrysoftdeliveryriders.com')
                    .subject('Welcome To Cherrysoft Delivery Riders')
            })
    
            return 'mail-sent'

        } catch (error) {
            
            return 'error'
        }

    }
}

module.exports = WelcomeMail
