'use strict'

const Admin = use('App/Models/Admin');
const AdminController = use('App/Controllers/Http/Admin/AdminController')
const dayjs = use('dayjs')
const Hash = use('Hash')
const Env = use('Env')
const ResendVerifyCodeMail = use('App/Controllers/Http/Email/ResendVerifyCodeMail')

class AuthController {
    
    constructor(){
        this.verifyCodeBreakOut = 0; this.adminCodeBreakOut = 0;
    }
    async makeAdminCommand() {
        const adminData = {
            firstname: Env.get('ADMIN_FIRSTNAME_COMMAND'),
            lastname: Env.get('ADMIN_LASTNAME_COMMAND'),
            email: Env.get('ADMIN_EMAIL_COMMAND'),
            role: "super_admin"
        }
       const result = await this.register(adminData, Env.get('ADMIN_PASSWORD_COMMAND'))
       return result
    }

    async makeAdminApp({request, response}) {
        const password  =  await this.passwordGenerator(8)//Genrated a ramdom password for user 
        const result = await this.register(request.post(), password)
        return response.status(result.status_code).json(result)
    }

    async register(adminData, password) {
        const adminController = new AdminController
        const verify_code =  await this.createVerifyCode();
        const admin_code  =  await this.createAdminCode()

        if(this.verifyCodeBreakOut === 3 || this.adminCodeBreakOut === 3){
            this.verifyCodebreakOut = 0
            this.adminCodeBreakOut  = 0
            return {success: false, message: 'An error occured, this might be a network issue or error generating a secure details for admin, please try again', status_code: 501}
        }

        Object.assign(adminData, {password: await Hash.make(password), verify_code, admin_code})

        let res = await adminController.store(adminData, password, verify_code) //Transfer to Admin Controller
        switch(res.status) {
            case 201:
                return {success: res.success, message: res.message, data: res.admin, status_code: 201}
            case 501: 
                return {success: res.error, message: res.message, hint: res.hint, status_code: 501}
        }
    }

    async login({request, auth, response}) {
        let {email, password} = request.post();

        try {
            if(await auth.authenticator('adminJwt').attempt(email, password)) {
                const admin = await Admin.findBy('email', email)
                const token = await auth.generate(admin)
                const photo = {
                    photoUrl: Env.get('CLOUDINARY_IMAGE_URL'),
                    image: admin.photo
                }
                Object.assign(admin, {photo, token})

                const currentDate = dayjs().format(); 
                const accountVerifyDate = dayjs(admin.account_verified_at).format();
    
                if(accountVerifyDate < currentDate){
                    const mailResponse = await this.sendCode(admin)
                    return response.status(mailResponse.status_code).json(mailResponse)
                }

                return response.status(200).json({success:true, admin})
            }
        } catch (error) {
            return response.status(501).json({error: false, message: 'Invalid Details, please check if email or password are correct, if issues persit please contact support.', hint: error.message})
        }
    }

    async passwordGenerator(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
     }

    async createVerifyCode () {
        const verify_code = Math.floor(100000 + Math.random() * 900000);
        const checkIfExist = await Admin.findBy('verify_code', verify_code)
        if(checkIfExist) {
            if(this.verifyCodeBreakOut < 3) {
                this.verifyCodeBreakOut++;
                await this.createVerifyCode(); 
            }
        }
        return verify_code;
    }
    async createAdminCode () {
        const admin_code = `CDR/ADMIN${Math.floor(1000 + Math.random() * 9000)}`
        const checkIfExist = await Admin.findBy('admin_code', admin_code)
        if(checkIfExist) {
            if(this.adminCodeBreakOut < 3) {
                this.adminCodeBreakOut++;
                await this.createAdminCode();
            }
        }
        return admin_code;
    }
    async sendCode (admin) {
        const resendVerifyCodeMail = new ResendVerifyCodeMail

        const link = `${Env.get('FRONTEND_URL')}/auth?authType=adminLogin&link_code=${admin.verify_code}`
        const code = {code: admin.verify_code, link, sendMailTo: admin.email}
        Object.assign(admin, code)
        
        //Send a Mail for verification
        const mailOut = await resendVerifyCodeMail.send(admin, link)

        admin.code = null; admin.link = null; admin.note = null; admin.sendMailTo = null

        if(!mailOut.status) {
          return {
                status: false, 
                message: `Please there was an error sending you a verification mail, please refresh and try again or contact support to report this issue.`,
                status_code: 501
            }
        } 
        return {status: true,
                message: `A verification code have sent to your email, please use to confirm account!`,
                hint: `Why are you getting this: This is becuase our admin route should be protected at all time.`,
                status_code: 200
            }
    }

}

module.exports = AuthController
