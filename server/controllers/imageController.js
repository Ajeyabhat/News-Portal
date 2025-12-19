const sharp = require('sharp');
const { uploadImageToImgBB } = require('../services/imgbbService');

// Upload and compress image, then store on ImgBB
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const file = req.file;
    const originalSize = file.size;

    // Validate file size (ImgBB max is 32MB)
    if (originalSize > 32 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size exceeds 32MB limit' });
    }

    // Compress image using sharp
    const compressedBuffer = await sharp(file.buffer)
      .resize(1920, 1080, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 80 })
      .toBuffer();

    // Generate filename
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.webp`;

    // Upload compressed image to ImgBB
    const imgbbResult = await uploadImageToImgBB(compressedBuffer, fileName);

    if (!imgbbResult || !imgbbResult.url) {
      throw new Error('ImgBB upload failed - no URL returned');
    }

    // Calculate compression ratio
    const compressedSize = compressedBuffer.length;
    const compressionRatio = ((1 - compressedSize / originalSize) * 100).toFixed(2);

    res.status(200).json({
      success: true,
      imageUrl: imgbbResult.url,
      displayUrl: imgbbResult.displayUrl,
      deleteUrl: imgbbResult.deleteUrl,
      fileName,
      originalSize: `${(originalSize / 1024).toFixed(2)} KB`,
      compressedSize: `${(compressedSize / 1024).toFixed(2)} KB`,
      compressionRatio: `${compressionRatio}%`,
      message: `Image uploaded successfully (compressed by ${compressionRatio}%)`
    });

  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload image',
      message: error.message 
    });
  }
};

module.exports = { uploadImage };
