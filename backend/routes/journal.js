const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');
const multer = require('multer');
const JournalEntry = require('../models/JournalEntry');
const JournalEmployee = require('../models/JournalEmployee');

// Multer setup
const storage = multer.diskStorage({
  destination: function(req, file, cb){ cb(null, 'uploads/'); },
  filename: function(req, file, cb){ cb(null, Date.now() + '-' + file.originalname); }
});
const upload = multer({ storage });

// Create Journal Entry
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const { date, total_items_produced, notes, employees } = req.body;
    const entry = await JournalEntry.create({
      date,
      total_items_produced,
      notes,
      photo_path: req.file ? req.file.path : null
    });

    const employeeData = JSON.parse(employees); // frontend sends JSON string
    employeeData.forEach(async emp => {
      await JournalEmployee.create({ ...emp, journal_id: entry.id });
    });

    res.json({ success: true, entry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all journal entries (optional: filter by month/year)
router.get('/', async (req, res) => {
  try {
    const { month, year } = req.query;
    let condition = {};
    if(month && year){
      condition.date = sequelize.where(sequelize.fn('MONTH', sequelize.col('date')), month);
      // For YEAR filter, add similar logic if needed
    }
    const entries = await JournalEntry.findAll({
      include: [JournalEmployee],
      order: [['date','ASC']]
    });
    res.json(entries);
  } catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
