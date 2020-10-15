'use strict'
const CurrentOrder = use('App/Models/CurrentOrder')
const Database = use('Database')

class OrderRecordController {
    async getOrderRecords({ response, auth, params: { page } }) {

        !auth.user.rider_code ? Object.assign(auth.user, {rider_code: null}) : null;
        const orderRecord = await CurrentOrder.query()
                                        .whereIn('status', ['Accepted', 'Declined'])
                                        .where((builder) => {
                                          builder.where('customer_id', auth.user.id)
                                                  .orWhere('rider_code', auth.user.rider_code)
                                          })
                                        .with('customer').with('rider').with('transitReport')
                                        .paginate(page)
  
        response.status(200).json({success: true, message: "Your Order Record for pass 28 days", orderRecord })
      }
    
}

module.exports = OrderRecordController
