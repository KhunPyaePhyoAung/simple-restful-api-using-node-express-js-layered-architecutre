require('dotenv').config();
const path = require('path');
const uuid = require('uuid').v4;
const fs = require('fs/promises');

const BASE_URL = process.env.SERVER_BASE_URL;
const productImageFolder = path.join(__dirname, '..', 'image', 'product');

const saveImages = async (images) => {
    const imageUrls = [];
    images.forEach(image => {
        let ext = path.extname(image.name);
        let imageName = uuid() + ext;
        let imagePath = path.join(productImageFolder, imageName);
        let imageUrl = [BASE_URL, 'products', 'images', imageName].join('/');
        image.mv(imagePath);
        imageUrls.push(imageUrl);
    });
    return imageUrls;
};

const getImage = async (name) => {
    const image = await fs.readFile(path.join(productImageFolder, name));
    return image;
};

const getPath = async (name) => {
    const imagePath = path.join(productImageFolder, name);
    return imagePath;
};

module.exports = {
    saveImages,
    getImage,
    getPath
};