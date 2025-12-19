/**
 * ImgBB Image Upload Service
 * Handles image uploads to ImgBB cloud storage
 */

const axios = require('axios');
const FormData = require('form-data');

const IMGBB_API_URL = 'https://api.imgbb.com/1/upload';
const IMGBB_API_KEY = process.env.IMGBB_API_KEY;

/**
 * Upload image to ImgBB
 * @param {Buffer} imageBuffer - Image file buffer
 * @param {String} filename - Original filename
 * @returns {Promise<String>} - Permanent ImgBB URL
 */
exports.uploadImageToImgBB = async (imageBuffer, filename) => {
  try {
    if (!IMGBB_API_KEY) {
      throw new Error('ImgBB API key not configured');
    }

    // Create form data
    const formData = new FormData();
    formData.append('image', imageBuffer, filename);
    formData.append('key', IMGBB_API_KEY);

    // Upload to ImgBB
    const response = await axios.post(IMGBB_API_URL, formData, {
      headers: formData.getHeaders(),
      timeout: 30000 // 30 second timeout
    });

    // Check response
    if (!response.data.success) {
      throw new Error('ImgBB upload failed: ' + (response.data.error?.message || 'Unknown error'));
    }

    // Return permanent URL
    return {
      url: response.data.data.url, // Direct image URL
      displayUrl: response.data.data.display_url, // Display URL
      deleteUrl: response.data.data.delete_url, // Delete URL (if needed later)
      id: response.data.data.id // Image ID
    };
  } catch (error) {
    console.error('ImgBB upload error:', error.message);
    throw new Error('Failed to upload image: ' + error.message);
  }
};

/**
 * Upload image from URL to ImgBB
 * @param {String} imageUrl - Image URL to upload
 * @returns {Promise<String>} - Permanent ImgBB URL
 */
exports.uploadImageURLToImgBB = async (imageUrl) => {
  try {
    if (!IMGBB_API_KEY) {
      throw new Error('ImgBB API key not configured');
    }

    // Create form data with URL
    const formData = new FormData();
    formData.append('image', imageUrl);
    formData.append('key', IMGBB_API_KEY);

    // Upload to ImgBB
    const response = await axios.post(IMGBB_API_URL, formData, {
      headers: formData.getHeaders(),
      timeout: 30000
    });

    // Check response
    if (!response.data.success) {
      throw new Error('ImgBB upload failed: ' + (response.data.error?.message || 'Unknown error'));
    }

    // Return permanent URL
    return {
      url: response.data.data.url,
      displayUrl: response.data.data.display_url,
      deleteUrl: response.data.data.delete_url,
      id: response.data.data.id
    };
  } catch (error) {
    console.error('ImgBB URL upload error:', error.message);
    throw new Error('Failed to upload image from URL: ' + error.message);
  }
};
