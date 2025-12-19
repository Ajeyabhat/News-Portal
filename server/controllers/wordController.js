/**
 * Word Document Upload Controller
 * Handles .docx file uploads and extraction
 */

const { extractWordContent } = require('../services/wordService');

/**
 * Upload and extract Word document
 * POST /api/upload/word
 */
const uploadWord = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const file = req.file;

    // Validate file type
    if (file.mimetype !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
        file.mimetype !== 'application/msword') {
      return res.status(400).json({ 
        error: 'Invalid file type! Only .docx and .doc files are allowed',
        receivedType: file.mimetype
      });
    }

    // Validate file size (max 5MB for Word documents)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return res.status(400).json({ 
        error: 'File size exceeds 5MB limit',
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
      });
    }

    // Extract content from Word document
    const result = await extractWordContent(file.buffer);

    if (!result.success) {
      return res.status(400).json({ 
        error: result.error || 'Failed to extract content from Word document' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Word document processed successfully',
      extracted: result.data,
      fileName: file.originalname,
      fileSize: `${(file.size / 1024).toFixed(2)} KB`
    });

  } catch (error) {
    console.error('Word upload error:', error);
    res.status(500).json({ 
      error: 'Failed to process Word document',
      message: error.message 
    });
  }
};

module.exports = { uploadWord };
