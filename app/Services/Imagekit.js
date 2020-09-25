 
const imagekitEngine = use("imagekit");
const Env = use('Env')

const imagekit = new imagekitEngine({
    publicKey : Env.get('IMAGEKIT_PUBLIC_API_KEY'),
    privateKey : Env.get('IMAGEKIT_PRIVATE_API_KEY'),
    urlEndpoint : Env.get('IMAGEKIT_PUBLIC_URL')
});

module.exports = {
    upload: async (data, file_folder, extname) => {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await imagekit.upload({
                    file : data,
                    fileName : `cdr_file.${extname}`,
                    folder : `${Env.get('IMAGE_APP_FOLDER')}/${file_folder}`
                })
                resolve({status: true, image_up_info: response, status_code: 200})
            } catch (error) {
                reject({status: false, image_up_info: error.message, status_code: 501}) 
            }
        })
    },

    destroy: async (fileId) => {
        return new Promise(async (resolve, reject) => {
             try {
                let response = await imagekit.deleteFile(fileId)
                resolve({status: true, image_del_info: response, status_code: 200})
             } catch (error) {
                reject({status: false, image_del_info: error.message, status_code: 501})
             }
        })
    }   
}