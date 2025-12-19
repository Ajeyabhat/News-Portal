const WordSubmission = require('../models/WordSubmission');
const { extractWordContent } = require('../services/wordService');

// POST: Upload Word document for admin review
exports.uploadWordSubmission = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Validate MIME type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];

    if (!validTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: 'Invalid file type. Only .docx and .doc files are allowed.' });
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (req.file.size > maxSize) {
      return res.status(400).json({ error: 'File size must be less than 5MB' });
    }

    // Extract content from Word document
    let extractedData = {};
    try {
      extractedData = await extractWordContent(req.file.buffer);
    } catch (extractErr) {
      console.error('Word extraction error:', extractErr);
      // Continue anyway - admin can manually review the file
    }

    // Create Word submission record
    const wordSubmission = new WordSubmission({
      institutionId: req.user.id,
      institutionName: req.user.username,
      fileName: req.file.originalname,
      fileBuffer: req.file.buffer,
      mimetype: req.file.mimetype,
      extractedData,
      status: 'pending',
    });

    await wordSubmission.save();

    res.status(201).json({
      message: 'Word document submitted successfully! Admin will review it soon.',
      submission: {
        id: wordSubmission._id,
        fileName: wordSubmission.fileName,
        status: wordSubmission.status,
        extractedData: wordSubmission.extractedData,
      },
    });
  } catch (error) {
    console.error('Upload Word submission error:', error);
    res.status(500).json({ error: 'Failed to submit Word document' });
  }
};

// GET: Retrieve Word submission for admin download
exports.getWordSubmission = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Only admins can download Word submissions' });
    }

    const wordSubmission = await WordSubmission.findById(id);

    if (!wordSubmission) {
      return res.status(404).json({ error: 'Word submission not found' });
    }

    // Set response headers for file download
    res.setHeader('Content-Type', wordSubmission.mimetype);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${wordSubmission.fileName}"`
    );

    res.send(wordSubmission.fileBuffer);
  } catch (error) {
    console.error('Get Word submission error:', error);
    res.status(500).json({ error: 'Failed to retrieve Word submission' });
  }
};

// GET: List all Word submissions (admin only)
exports.getWordSubmissions = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Only admins can view Word submissions' });
    }

    const submissions = await WordSubmission.find()
      .select('-fileBuffer')
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
    console.error('Get Word submissions error:', error);
    res.status(500).json({ error: 'Failed to retrieve Word submissions' });
  }
};

// PATCH: Update Word submission status (admin only)
exports.updateWordSubmissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Only admins can update Word submissions' });
    }

    // Validate status
    const validStatuses = ['pending', 'reviewing', 'published', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const wordSubmission = await WordSubmission.findByIdAndUpdate(
      id,
      { status, adminNotes },
      { new: true }
    ).select('-fileBuffer');

    if (!wordSubmission) {
      return res.status(404).json({ error: 'Word submission not found' });
    }

    res.json({
      message: 'Word submission updated successfully',
      submission: wordSubmission,
    });
  } catch (error) {
    console.error('Update Word submission error:', error);
    res.status(500).json({ error: 'Failed to update Word submission' });
  }
};

// DELETE: Delete Word submission (admin only)
exports.deleteWordSubmission = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Only admins can delete Word submissions' });
    }

    const wordSubmission = await WordSubmission.findByIdAndDelete(id);

    if (!wordSubmission) {
      return res.status(404).json({ error: 'Word submission not found' });
    }

    res.json({ message: 'Word submission deleted successfully' });
  } catch (error) {
    console.error('Delete Word submission error:', error);
    res.status(500).json({ error: 'Failed to delete Word submission' });
  }
};
