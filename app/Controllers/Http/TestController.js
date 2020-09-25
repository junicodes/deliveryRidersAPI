'use strict'
const Database = use('Database')
const ImagekitFileUploadController = use('App/Controllers/Http/FileUpload/ImagekitFileUploadController')
const Env = use('Env')
const fs = use('fs');
const Jimp = use('jimp');
const imagekitEngine = use("imagekit");

const imagekit = new imagekitEngine({
    publicKey : Env.get('IMAGEKIT_PUBLIC_API_KEY'),
    privateKey : Env.get('IMAGEKIT_PRIVATE_API_KEY'),
    urlEndpoint : Env.get('IMAGEKIT_PUBLIC_URL')
});

class TestController {

    async imageCompress({ request, auth, response }) {
        const imagekitFileUpload = new ImagekitFileUploadController;
        const customer = auth.user;
        const file_folder = 'request-orders';

        const receiver_photo = request.file('receiver_photo', { type: ['image', 'video'], size: '100mb', extnames: ['png', 'jpg', 'jpeg', 'mp4'] });
        // // const product_photo = request.file('product_photo', { types: ['image'], size: '100mb', extnames: ['png', 'jpg', 'jpeg'] });
        // // let buff = fs.readFileSync(receiver_photo.tmpPath);
        // let fileId = "5f5b25211efdee4d01c21f5f";
        // if(fileId) {
        //     const deleteFile = await imagekitFileUpload.handleDelete(fileId)
        //         console.log(deleteFile)
        //     if(!deleteFile.status) {
        //         console.log(error)
        //         return response.status(deleteFile.status_code).json({ status:deleteFile.status, message: 'Error uploading images, please refresh and try again!', deleteFile})
        //     }
           
        // }
        // console.log('pass deleted ')
        // const buffResize = await this.resize(receiver_photo.tmpPath)
        // let base64data = buffResize.toString('base64');

        // const res = await imagekitFileUpload.handleUpload(base64data, file_folder, receiver_photo.extname);
        //return response.status(200).json({ status: true, message: 'Your Order request is successfull!', res })
    }
    async resize(file) {
        const image = await Jimp.read(file);
        await image.resize(225, 225);
        return await image.getBufferAsync(Jimp.AUTO)//Generate a buffer code
        //await image.writeAsync(`test/${Date.now()}_crop_150x150.png`);
    }
}

module.exports = TestController
