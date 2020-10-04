'use strict'
const CurrentOrder = use('App/Models/CurrentOrder')
const Database = use('Database')

class OrderRecordController {
    async getOrderRecords({ response, auth, params: { page } }) {
        let orderRecords; 

        !auth.user.rider_code ? Object.assign(auth.user, {rider_code: null}) : null;
        currentOrders = await CurrentOrder.query()
                                        .whereIn('status', ['Accepted', 'Declined'])
                                        .where((builder) => {
                                          builder.where('customer_id', auth.user.id)
                                                  .orWhere('rider_code', auth.user.rider_code)
                                          })
                                        .with('customer').with('rider').with('transitReport')
                                        .paginate(page)
  
        response.status(200).json({ message: "Your Order Record for pass 28 days", data: orderRecords })
      }
    
}

module.exports = OrderRecordController
