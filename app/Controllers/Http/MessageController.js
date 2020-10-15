'use strict'
const Message = use('App/Models/Message')
const Database = use('Database')
const Env = use('Env')

class MessageController {

    async fetchMessages({response, auth, params: { page }}) {
        const messages = await Message.query()
                                .where('from_id', auth.user.id)
                                .orWhere('to_id', auth.user.id)
                                .paginate(page);
                            
        return response.status(200).json({status: true, message: 'Your messages', messages})   
    }

    async sendMessage({request, auth, response}) {
        console.log(request.post())
        const {to_user_data, title, description} = request.post()
        const messageToID = JSON.parse(to_user_data.id)

        let to_all = false;
        auth.user.role ? to_all = true : null;
        const trx = await Database.beginTransaction()
        
        try {
            Object.assign(request.post(), {from_id: auth.user.id, 
                to_id: messageToID, 
                from_user_data: JSON.stringify(auth.user), 
                to_user_data: JSON.stringify(to_user_data),
                to_all,
                description,
                title
            })
           await Message.create(request.post());
           await trx.commit()
    
           return response.status(200).json({status: true, message: 'Message sent succesfully'})   
        } catch (error) {
           await trx.rollback()
           return response.status(501).json({ status: false, message: 'An unexpected error occured!', hint: error.message })
        }
    }
}

module.exports = MessageController
