const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createJournalEntry, getJournalEntries } = require('../controllers/journalController');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Routes
router.post('/', upload.single('photo'), createJournalEntry);
router.get('/', getJournalEntries);

module.exports = router;
