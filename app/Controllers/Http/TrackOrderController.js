'use strict'
const CurrentOrder = use('App/Models/CurrentOrder')
const Env = use('Env')

class TrackOrderController {
     async trackOrder({ request, auth, params: {orderId}, response }) { 
        const user = await auth.getUser(); 

        if(!orderId) {
            return response.status(422).json({
                status: false,
                messgae: 'The order id is required to continue'
            })
        }

        !user.rider_code ? Object.assign(user, {rider_code: null}) : null;

        const trackOrder = await CurrentOrder.query().where('order_id', orderId)
                                             .where((builder) => {
                                                     builder.where('customer_id', user.id)
                                                            .orWhere('rider_code', user.rider_code)
                                              })
                                             .with('customer').with('rider').with('transitReport')
                                             .first()
        trackOrder ? Object.assign(trackOrder, {acceptance_code: null, photoUrl: Env.get('CLOUDINARY_IMAGE_URL')}): null
        return response.status(trackOrder ? 200 : 404).json({
            status: trackOrder ? true : false,
            message: trackOrder != null ? 'Your tracked requested order'
                                : 'You are not permmited to track this request order or it does not exist in our system.',
            hint: trackOrder == null ? 
                  `Check if the (Order Id) is correctly typed or if you think this is an issue, please contact support` : null,
            trackOrder
        })
        // if(user.getRelated('currentOrder')) {}
    }
}

module.exports = TrackOrderController
