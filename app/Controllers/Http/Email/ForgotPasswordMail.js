const Mail = use('Mail')


class ForgotPasswordMail {

    async send (user) {
        try {
            await Mail.send('emails.forgotPassword', user.toJSON(), (message) => {
                message
                    .to(user.sendMailTo)
                    .from('info@cherrysoftdeliveryriders.com')
                    .subject('Reset Password Verification Code')
            })
        
            return {status: true}

        } catch (error) {
            
            return {status: false, hint: error}
        }
    }
}

module.exports = ForgotPasswordMail