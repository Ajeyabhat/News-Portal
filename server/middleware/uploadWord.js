const multer = require('multer');

// Configure memory storage
const storage = multer.memoryStorage();

// File filter to accept only Word documents
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/msword' // .doc
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only Word documents (.docx, .doc) are allowed'), false);
  }
};

// Multer configuration for Word documents
const uploadWord = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB limit for Word files
  }
});

module.exports = uploadWord;
