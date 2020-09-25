

const Cloudinary = use('App/Services/Cloudinary')

class SingleFileUploadController {

    async handleUpload (file, folder) {
        //Connect to cloudinary Storage 
        try {
            if(file){
                let cloudinary_response = await Cloudinary.upload(file, folder)
                return cloudinary_response;
            }
            return {status: false, error: 'Please upload an image', status_code: 400};
        } catch (error) {
            return {status: false, error, status_code: 501}
        }
    }

    async handleDelete (file) {
        
        try {
            console.log('here')
            if(file) {
                let cloudinary_response = await Cloudinary.destroy(file)
                return cloudinary_response;
            }
            return {status: false, error: 'Please provide a file to delete', status_code: 400}
        } catch (error) {
            return {status: false, error: error.message, status_code: 501}
        }
    }
}

module.exports = SingleFileUploadController
