 
const cloudinary = use('cloudinary').v2
const Env = use('Env')

cloudinary.config({
    cloud_name: Env.get('CLOUDINARY_CLOUD_NAME'),
    api_key: Env.get('CLOUDINARY_API_KEY'),
    api_secret: Env.get('CLOUDINARY_API_SECRET')
})

module.exports ={

    upload: async (file, folder) => {

        return new Promise(async (resolve, reject) => {

            try {

                let response = await cloudinary.uploader.upload(file.tmpPath, {folder: `${Env.get('CLOUDINARY_APP_FOLDER')}/${folder}`})
                
                resolve({status: true, image_up_info: response, status_code: 200})

            } catch (error) {
        
                reject({status: false, image_up_info: error.message, status_code: 501})
            }
        })
    },

    destroy: async (file) => {

        return new Promise(async (resolve, reject) => {
            console.log(file)
             try {
                let response = await cloudinary.uploader.destroy(file)

                resolve({status: true, image_del_info: response, status_code: 200})

             } catch (error) {
                reject({status: false, image_del_info: error.message, status_code: 501})
             }
        })
    }   
}