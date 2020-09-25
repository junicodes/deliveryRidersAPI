'use strict'

const Rider = use('App/Models/Rider')
const RiderController = use('App/Controllers/Http/Rider/RiderController')
const Hash = use('Hash')
const Env = use('Env')
const Logger = use('Logger')


class AuthController {

    constructor(){
        this.verifyCodeBreakOut = 0;
        this.riderCodeBreakOut = 0;
    }

    async register({request, response}) {

        const riderController = new RiderController

        const password    =  await this.passwordGenerator(8)//Genrated a ramdom password for user 
        const verify_code = await this.createVerifyCode();
        const rider_code  =  await this.createRiderCode()

        if(this.verifyCodeBreakOut === 3 || this.riderCodeBreakOut === 3){
            this.verifyCodebreakOut = 0
            this.riderCodeBreakOut = 0
            return response.status(501).json({success: false, message: 'An error occured, this might be a network issue or error generating a secure details for rider, please try again'})
        }

        const moreData = {
            password: await Hash.make(password), //Hash the pasword generated 
            verify_code,
            rider_code,
        }
        console.log(moreData)
        
        Object.assign(request.all(), moreData)

        let res = await riderController.store(request.all(), password) //Transfer to Rider Controller

        switch(res.status) {
            case 201:
                return response.status(res.status).json({success: res.success, message: res.message, data: res.rider})
            case 501: 
                return response.status(res.status).json({success: res.error, message: res.message, hint: res.hint})
        }
    }

    async login({request, auth, response}) {
        let {email, password} = request.post();
        Logger.info('request url is %s', request.url())
        try {
            if(await auth.authenticator('riderJwt').attempt(email, password)) {
                const rider = await Rider.findBy('email', email)
                const token = await auth.generate(rider)
                const photo = {
                    photoUrl: Env.get('CLOUDINARY_IMAGE_URL'),
                    image: rider.photo
                }
                Object.assign(rider, {photo})
                Object.assign(rider, token)
                return response.status(200).json({success:true, rider})
            }
        } catch (error) {
            return {error: false, message: 'Invalid Details, please check if email or password are correct, if issues persit please contact support.', hint: error.message, status:501}
        }
    }

    async passwordGenerator(length) {
        let result           = '';
        const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
     }
    async createVerifyCode () {
        const verify_code = Math.floor(100000 + Math.random() * 900000);
        const checkIfExist = await Rider.findBy('verify_code', verify_code)
        if(checkIfExist) {
            if(this.verifyCodeBreakOut < 3) {
                this.verifyCodeBreakOut++;
                await this.createVerifyCode(); 
            }
        }
            return verify_code;
    }

    async createRiderCode () {
        const rider_code = `CDR${Math.floor(1000 + Math.random() * 9000)}`
        const checkIfExist = await Rider.findBy('rider_code', rider_code)
        if(checkIfExist) {
            if(this.riderCodeBreakOut < 3) {
                this.riderCodeBreakOut++;
                await this.createRiderCode();
            }
        }
        return rider_code;
    }
}

module.exports = AuthController
