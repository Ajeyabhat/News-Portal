const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Upload and compress image
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const file = req.file;
    const fileName = `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const uploadDir = path.join(__dirname, '../uploads');

    // Ensure uploads directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Determine output format (prefer WebP for compression)
    const outputFormat = 'webp';
    const outputPath = path.join(uploadDir, `${fileName}.${outputFormat}`);

    // Compress and optimize image
    await sharp(file.buffer)
      .resize(1920, 1080, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 80 })
      .toFile(outputPath);

    // Calculate compression ratio
    const originalSize = file.size;
    const stats = fs.statSync(outputPath);
    const compressedSize = stats.size;
    const compressionRatio = ((1 - compressedSize / originalSize) * 100).toFixed(2);

    // Generate URL
    const imageUrl = `/uploads/${fileName}.${outputFormat}`;

    res.status(200).json({
      success: true,
      imageUrl,
      fileName: `${fileName}.${outputFormat}`,
      originalSize: `${(originalSize / 1024).toFixed(2)} KB`,
      compressedSize: `${(compressedSize / 1024).toFixed(2)} KB`,
      compressionRatio: `${compressionRatio}%`,
      message: `Image compressed by ${compressionRatio}%`
    });

  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload and compress image',
      message: error.message 
    });
  }
};

module.exports = { uploadImage };
