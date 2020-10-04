'use strict'

const CurrentOrder = use('App/Models/CurrentOrder')
const Database = use('Database')
const CurrentOrderMail = use("App/Controllers/Http/Email/Rider/WelcomeMail")
const ImagekitFileUploadController = use('App/Controllers/Http/FileUpload/ImagekitFileUploadController')
const Env = use('Env')
const fs = use('fs');
const Jimp = use('jimp');

class CurrentOrderController {

  constructor(){
    this.orderIdCodeBreakOut = 0; this.acceptanceCodeBreakOut = 0;
  }

  async currentOrders({ response, auth, params: { page } }) {
    let currentOrders;

    !auth.user.rider_code ? Object.assign(auth.user, {rider_code: null}) : null;
    currentOrders = await CurrentOrder.query()
                                    .whereIn('status', ['Processing', 'Pending', 'Delayed'])
                                    .where((builder) => {
                                      builder.where('customer_id', auth.user.id)
                                              .orWhere('rider_code', auth.user.rider_code)
                                      })
                                    .with('customer').with('rider').with('transitReport')
                                    .paginate(page)

    response.status(200).json({ message: "Your current orders", data: currentOrders })
  }


  async requestOrder({ request, auth, response }) {
    const imagekitFileUpload = new ImagekitFileUploadController;
    const {expectation_time} = request.post();
    const folder = 'request-orders';
    const customer = auth.user;
    const receiver_photo = request.file('receiver_photo');
    const product_photo = request.file('product_photo');

    //Validate expectation time 
    const splitTime = expectation_time.split(':')
    if(Number(splitTime[0]) < 9 ||  Number(splitTime[0]) > 17) {
      return response.status(422).json({status: false, message: 'Please choose a friendly working time between (9:00 AM - 5:00 PM)'})
    }

    const trx = await Database.beginTransaction()
    try {

        const order_id  =  await this.createOrderId()
        const acceptance_code  =  await this.createAcceptanceCode()

        if(this.orderIdCodeBreakOut === 3 || this.acceptanceCodeBreakOut  === 3){
            this.orderIdCodeBreakOut = 0
            this.acceptanceCodeBreakOut = 0;
            return response.status(501).json({success: false, message: 'An error occured, this might be a network issue or error generating a secure details for rider, please try again'})
        }

        if (receiver_photo.clientName !== '@cdr-faker-file-349089-ignore.png') {
          
            const res = await this.storeReceiverPhoto(receiver_photo, folder, imagekitFileUpload);
            
            Object.assign(request.post(), {
              receiver_photo: `${res.image_up_info.filePath}`,
              receiver_photo_file_id: `${res.image_up_info.fileId}`
            }) //-------------------Receiver Photo Upload To ImageKit

            if (!res) {return response.status(501).json({ status: false, message: 'Error uploading Receiver Photo, please refresh and try again!', hint: res})}
        }

        if (product_photo) {
          const product_photos = []
          const product_photo_fileIds = []
          const res = await this.storeProductPhoto(product_photo, folder, imagekitFileUpload);

          res.map(x => {
            product_photos.push(x.image_up_info.filePath)
            product_photo_fileIds.push(x.image_up_info.fileId)
          })

          Object.assign(request.post(), {
            product_photo: JSON.stringify(product_photos),
            product_photo_file_ids: JSON.stringify(product_photo_fileIds)
          })

          if (!res) {return response.status(501).json({ status: false, message: 'Error uploading Product Photos, please refresh and try again!', hint: res })}
        } //-------------------Product Photo Upload To ImageKit

        //------------------Store to database
        Object.assign(request.post(), { customer_id: customer.id, order_id, acceptance_code })

        const saveOrder = await CurrentOrder.create(request.post(), trx)
        await trx.commit()

        //Add Image url to the Object Payload
        Object.assign(saveOrder, { imagekitUrl: Env.get('IMAGEKIT_PUBLIC_URL'), imageCforce: Env.get('IMAGEKIT_CFORCE') })

        return response.status(200).json({ status: true, message: 'Your order request is successful!', currentOrder: saveOrder })
      } catch (error) {
        await trx.rollback()
        return response.status(501).json({ status: false, message: 'An unexpected error occured!', hint: error.message })
      }
    }

  async updateOrder({ request, auth, response }) {
      const checkFileId = await CurrentOrder.query().where('id', customer.id).fetch();

      const trx = await Database.beginTransaction()
      try {
        // let fileId = "5f5be8c382e9986641017af5";

        // if(fileId) {
        //     const deleteFile = await imagekitFileUpload.handleDelete(fileId)
        //     console.log(deleteFile)
        //     if(!deleteFile.status) {
        //         return response.status(deleteFile.status_code).json({status:deleteFile.status, message: 'Error uploading images, please refresh and try again!', hint: deleteFile})
        //     }
        // }
        await trx.commit()
        return response.status(200).json({ status: true, message: 'Your Order have been updated succesfully!' })

      } catch (error) {

        console.log(error)
        await trx.rollback()
        return response.status(501).json({ status: false, message: 'An unexpected error occured!', hint: error.message })
      }
    }

    async storeReceiverPhoto(receiver_photo, folder, imagekitFileUpload) {
      // let buff = fs.readFileSync(receiver_photo.tmpPath);
      const buffResize = await this.resize(receiver_photo.tmpPath); let base64data = buffResize.toString('base64');

      const res = await imagekitFileUpload.handleUpload(base64data, folder, receiver_photo.extname);

      return res;
    }

    async storeProductPhoto(product_photo, folder, imagekitFileUpload) {

      const asyncRes = await Promise.all(product_photo._files.map(async (file, y) => {

        const buffResize = await this.resize(file.tmpPath); let base64data = buffResize.toString('base64');

        const bit_res = await imagekitFileUpload.handleUpload(base64data, folder, file.extname);

        return bit_res;
      }));

      return asyncRes;
    }

    async resize(file) {
      const image = await Jimp.read(file);
      await image.resize(225, 225);
      return await image.getBufferAsync(Jimp.AUTO)//Generate a buffer code
      //await image.writeAsync(`test/${Date.now()}_crop_150x150.png`);
    }

    async createOrderId () {
      const order_id = `CDR${Math.floor(10000 + Math.random() * 90000)}`
      const checkIfExist = await CurrentOrder.findBy('order_id', order_id)

      if(checkIfExist) {
          if(this.orderIdCodeBreakOut < 3) {
              this.orderIdCodeBreakOut++;
              await this.createOrderId(); 
          }
      }
          return order_id;
    }
    async createAcceptanceCode () {
      const acceptance_code = Math.floor(1000 + Math.random() * 9000)
      const checkIfExist = await CurrentOrder.findBy('acceptance_code', acceptance_code)
      
      if(checkIfExist) {
          if(this.acceptanceCodeBreakOut < 3) {
              this.acceptanceCodeBreakOut++;
              await this.createAcceptanceCode(); 
          }
      }
          return acceptance_code;
    }
  }

module.exports = CurrentOrderController
