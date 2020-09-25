

const Imagekit = use('App/Services/Imagekit')

class ImagekitUploadController {

    async handleUpload (file, file_folder, extname) {
        //Connect to imagekit Storage 
        try {
            if(file){
                let imagekit_response = await Imagekit.upload(file, file_folder, extname)
                return imagekit_response;
            }
            
            return {status: false, error: 'Please upload an image', status_code: 400};
        } catch (error) {
            return {status: false, error: error.image_del_info, status_code: 501}
        }
    }

    async handleDelete (fileId) {
        
        try {
            if(fileId) {
                let imagekit_response = await Imagekit.destroy(fileId)
                return imagekit_response;
            }
            return {status: false, error: 'Please provide a file to delete', status_code: 400}
        } catch (error) {
            console.log(error)
            return {status: false, error: error.image_del_info, status_code: 501}
        }
    }
}

module.exports = ImagekitUploadController
