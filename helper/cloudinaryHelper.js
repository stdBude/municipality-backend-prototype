const cloudinary = require('../db/cloudinary');


const uploadImage = async (imagePath) => {

    // Use the uploaded file's name as the asset's public ID and 
    // allow overwriting the asset with new versions
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    try {
      // Upload the image
      const result = await cloudinary.uploader.upload(imagePath, options);
      
        console.log(result);
        return {public_id: result.public_id, secure_url: result.secure_url};

    } catch (error) {
        console.error(error);
      throw error;
    }
};

const deleteImage = async (publicId) => {
    try{
        const result = await cloudinary.uploader.destroy(publicId);
        console.log(result);
    }catch(e){
        console.error(e);
        throw e;
    }
}

module.exports = { uploadImage, deleteImage };