const fs = require('fs');
const path = require('path');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads/articles');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

exports.uploadImage = async (req, res) => {
  try {
    // Check if admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        code: 'PERMISSION_DENIED',
        message: 'Only admins can upload images'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        code: 'NO_FILE',
        message: 'No file provided'
      });
    }

    // Validate file type
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedMimes.includes(req.file.mimetype)) {
      // Delete the uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        code: 'INVALID_FILE_TYPE',
        message: 'Only JPEG, PNG, and WebP images are allowed'
      });
    }

    // Validate file size (max 5MB)
    if (req.file.size > 5 * 1024 * 1024) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        code: 'FILE_TOO_LARGE',
        message: 'Image size must be less than 5MB'
      });
    }

    // Generate public URL
    const imageUrl = `/uploads/articles/${req.file.filename}`;

    res.json({
      code: 'SUCCESS',
      message: 'Image uploaded successfully',
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (err) {
    console.error('Error uploading image:', err);
    
    // Clean up uploaded file if error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      code: 'UPLOAD_ERROR',
      message: 'Failed to upload image'
    });
  }
};
