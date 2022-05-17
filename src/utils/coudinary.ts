const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const cloudinaryImageUploadMethod = async (file: string) => {
    return new Promise((resolve) => {
        cloudinary.uploader.upload(file, (err: Error, res: any) => {
            if (err) return res.status(500).send('upload image error');
            resolve({
                res: res.secure_url
            });
        });
    });
};
export default cloudinaryImageUploadMethod;