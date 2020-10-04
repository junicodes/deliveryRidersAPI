'use strict'

const dayjs = use("dayjs")

const Database = use('Database')
const TransitReport = use('App/Models/TransitReport')

class TransitReportController {

    async getAllTransitReport({ params: {page}, response}) {//Admin Only

        const transitReport = await TransitReport.query().paginate(page)

        return response.status(200).json({
            status: true,
            message: 'All Transit Report!', transitReport
        })
    }

    async getTransitReport({ params: { currentOrderId, page }, response }) {
        console.log(Number(currentOrderId))
        const transitReport = await TransitReport.query()
            .where('current_order_id', currentOrderId)
            .paginate(page)
            console.log(transitReport)

        return response.status(200).json({
            status: true,
            message: 'Transit Report!', transitReport
        })
    }

    async createTransitReport({ request, auth, params: { currentOrderId }, response }) {

        const { report } = request.post()

        const res = await this.validateCreateTransitReport(report, 'Current Order', currentOrderId)
        if (res) { return response.status(422).json(res) }

        const trx = await Database.beginTransaction()
        try {

            Object.assign(request.post(), { current_order_id: Number(currentOrderId), report_time: dayjs().format('YYYY-MM-DD h:mm:ss a') })

            const transitReport = await TransitReport.create(request.post(), trx)
            trx.commit()

            return response.status(200).json({ status: true, message: 'Transit Report submitted succesfully!', transitReport })
        } catch (error) {
            await trx.rollback()
            return response.status(501).json({ status: false, message: 'An unexpected error occured', hint: error.message })
        }
    }

    async destroyTransitReport({ request, params: { transitReportId }, response }) {

        try {
            const transitReport = await TransitReport.findBy('id', Number(transitReportId))
                  await transitReport.delete()

            response.status(200).json({status: true, message: "transit Report Deleted Succesfully!"});
           } catch (error) {
            response.status(501).json({status: false, message: 'An unexpected error occured when updating your account.', hint:  error.message});
           }

    }

    //Validation
    async validateCreateTransitReport(report, name, params) {
        if (!report) {
            return {
                status: false,
                message: 'Report Field is required!'
            }
        }
        if (isNaN(params)) {
            return {
                status: false,
                message: `${name} must be an interger!`
            }
        }
    }
}

module.exports = TransitReportController







































































































































































// async updateTransitReport({ request, auth, params: { transitReportId }, response }) {

//     const { report } = request.post()

//     const res = await this.validateCreateTransitReport(report, 'Transit Report Id', transitReportId)
//     if (res) { return response.status(422).json(res) }

//     const trx = await Database.beginTransaction()
//     try {

//         Object.assign(request.post(), {report_time: dayjs().format('YYYY-MM-DD h:mm:ss a') })

//         const transitReport = TransitReport.findBy('id', Number(transitReportId))
//               transitReport.report = report
//               await transitReport.save(trx)
//               trx.commit()

//         return response.status(200).json({ status: true, message: 'Transit Report updated succesfully!', transitReport })
//     } catch (error) {
//         await trx.rollback()
//         return response.status(501).json({ status: false, message: 'An unexpected error occured', hint: error.message })
//     }
// }