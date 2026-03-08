import { v2 as cloudinary } from 'cloudinary';

/**
 * Configure Cloudinary for image uploads
 * Ensure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET are set in .env
 */
const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  console.log('☁️  Cloudinary configured');
};

export { cloudinary, configureCloudinary };
