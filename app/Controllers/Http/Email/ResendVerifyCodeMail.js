const Mail = use('Mail')


class ResendVerifyCodeMail {

    async send (user) {
        try {
            await Mail.send('emails.resendVerifyCode', user.toJSON(), (message) => {
                message
                    .to(user.sendMailTo)
                    .from('info@cherrysoftdeliveryriders.com')
                    .subject('Resend Verification Code')
            })
        
            return {status: true}

        } catch (error) {
            
            return {status: false, hint: error}
        }
    }
}

module.exports = ResendVerifyCodeMail