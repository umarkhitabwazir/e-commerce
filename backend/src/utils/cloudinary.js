import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});


const uploadOnCloudinary = async (buffer) => {
    console.log('Cloudinarybuffer',buffer)
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "ecommerce/products-img",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
        } else {
          console.log('result',result)
          resolve(result);
        }
      }
    );

    stream.end(buffer); 
  });
};

export { uploadOnCloudinary };
