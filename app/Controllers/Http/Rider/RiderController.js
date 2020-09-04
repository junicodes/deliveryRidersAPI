'use strict'

const Rider = use('App/Models/Rider')
const Database = use('Database')
const WelcomeMail = use("App/Controllers/Http/Email/Rider/WelcomeMail")
const SingleFileUploadController = use('App/Controllers/Http/FileUpload/SingleFileUploadController')
const Env = use('Env')

class RiderController {

    async index({ response, params: { page } }) {
        const riders = await Rider.query().paginate(page)

        response.status(200).json({
            message: "All Riders",
            data: riders
        })
    }

    async store(rider, password) {
        const trx = await Database.beginTransaction()
        const welcomeMail = new WelcomeMail

        try {
            const riderInfo = await Rider.create(rider, trx)

            const link = `${Env.get('FRONTEND_URL')}/auth?authType=riderLogin`

            const email_secrete = { pass: password, link: link }

            Object.assign(riderInfo, email_secrete)

            const mailOut = await welcomeMail.send(riderInfo, link)

            if (!mailOut.status) {
                return { error: false, message: 'Please there was an error sending login details to your rider email account, this could be a bad network connection, please refresh and try again or contact technical support.', hint: mailOut.hint, status: 501 }
            }

            await trx.commit()
            riderInfo.pass = null
            riderInfo.link = null

            return { success: true, message: `Hurray! Rider registration was successful, please rider should recieve an email to account (${rider.email}) to login, Thank you.`, rider: riderInfo, status: 201 }
        } catch (error) {
            await trx.rollback()
            return { error: false, message: 'An unexpected error occured when creating a rider.', hint: error.message, status: 501 }
        }
    }
    async update({ request, auth, response }) {
        const singleFileUpload = new SingleFileUploadController;
        const rider = auth.user;
        const {firstname, lastname, address, city, state} = request.all()
        const folder = 'riders';
        const dbFile = rider.photo;
        const trx = await Database.beginTransaction();

        try {
            rider.firstname = firstname;
            rider.lastname = lastname;
            rider.address = address;
            rider.city = city;
            rider.state = state;

            //handle file Upload
            if (request.file('photo').clientName !== '@cdr-faker-file-349089-ignore.png') {
                const file = request.file('photo', {
                    types: ['image'],
                    size: '1000mb',
                    extnames: ['png', 'jpg', 'jpeg']
                });
  
                if(dbFile !== Env.get('DEFAULT_PHOTO')) {
                    const delRes = await singleFileUpload.handleDelete(dbFile); //Delete an existing image from Cloudinary if in Database
                    if(!delRes.status) {return response.status(delRes.status_code).json({ message:'An error occured while uploading image', hint: delRes.image_del_info})}
                }

                const res = await singleFileUpload.handleUpload(file, folder);
                if (!res.status) { return response.status(res.status_code).json({ message: 'An error occured while uploading image', hint: res.image_up_info }) }
                rider.photo = `${res.image_up_info.public_id}.${res.image_up_info.format}` //Save image to Db and generate for response
            }
            await rider.save(trx);
            trx.commit(); //once done commit the transaction

            const photo = {
                photoUrl: Env.get('CLOUDINARY_IMAGE_URL'),
                image: rider.photo
            }
            Object.assign(rider, { photo })

            response.status(200).json({ status: true, message: 'Your Account has been updated successfully!', rider });
        } catch (error) {
            await trx.rollback()
            response.status(501).json({ status: false, message: 'An unexpected error occured when updating your account.', hint: error.message });
        }
    }

    async findRiders({response, params: {query, page}}) {

        console.log(query, page)
        const findRiders = await Rider.query()
                        .where('rider_code', 'LIKE', `%${query}%`)
                        .orWhere('email', 'LIKE', `%${query}%`)
                        .orWhere('firstname', 'LIKE', `%${query}%`)
                        .orWhere('lastname', 'LIKE', `%${query}%`)
                        .orWhere('active_vicinity', 'LIKE', `%${query}%`)
                        .orWhere('address', 'LIKE', `%${query}%`)
                        .orWhere('city', 'LIKE', `%${query}%`)
                        .orWhere('state', 'LIKE', `%${query}%`)
                        .paginate(page, 20);
        console.log(findRiders)
        
        return response.status(200).json({status: true, message: `search riders result for ${query}`, findRiders})

    }
}

module.exports = RiderController
