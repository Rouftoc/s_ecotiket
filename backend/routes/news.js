const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure Multer for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads/news'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'news-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Public routes
router.get('/', newsController.getAllNews);
router.get('/:id', newsController.getNewsById);

// Protected routes (Admin only)
router.post('/', authenticateToken, requireRole(['admin']), upload.single('image'), newsController.createNews);
router.put('/:id', authenticateToken, requireRole(['admin']), upload.single('image'), newsController.updateNews);
router.delete('/:id', authenticateToken, requireRole(['admin']), newsController.deleteNews);

module.exports = router;
