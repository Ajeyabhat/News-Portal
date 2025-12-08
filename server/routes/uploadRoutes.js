const express = require('express');
const upload = require('../middleware/upload');
const { uploadImage } = require('../controllers/imageController');
const auth = require('../middleware/auth');

const router = express.Router();

// POST upload image (authenticated)
router.post('/upload', auth, upload.single('image'), uploadImage);

module.exports = router;
