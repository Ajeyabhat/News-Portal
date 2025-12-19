const express = require('express');
const upload = require('../middleware/upload');
const uploadWord = require('../middleware/uploadWord');
const { uploadImage } = require('../controllers/imageController');
const { uploadWord: uploadWordFile } = require('../controllers/wordController');
const auth = require('../middleware/auth');

const router = express.Router();

// POST upload image (authenticated)
router.post('/upload', auth, upload.single('image'), uploadImage);

// POST upload Word document (authenticated)
router.post('/upload/word', auth, uploadWord.single('document'), uploadWordFile);

module.exports = router;
