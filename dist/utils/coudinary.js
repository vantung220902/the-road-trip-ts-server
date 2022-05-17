"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const cloudinaryImageUploadMethod = async (file) => {
    return new Promise((resolve) => {
        cloudinary.uploader.upload(file, (err, res) => {
            if (err)
                return res.status(500).send('upload image error');
            resolve({
                res: res.secure_url
            });
        });
    });
};
exports.default = cloudinaryImageUploadMethod;
//# sourceMappingURL=coudinary.js.map