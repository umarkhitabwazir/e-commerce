import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder:`ecommerce/products-img`
        })
       
        console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        console.log(error)
        fs.unlinkSync(localFilePath) 
        return null;
    }
}



export {uploadOnCloudinary}