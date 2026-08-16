const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

function uploadImage(buffer) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "wanderlust_DEV",
                resource_type: "image",
                allowed_formats: ["png", "jpg", "jpeg", "webp"],
            },
            (error, result) => {
                if (error) return reject(error);
                return resolve(result);
            }
        );
        stream.end(buffer);
    });
}

module.exports = {
    cloudinary,
    uploadImage,
};
