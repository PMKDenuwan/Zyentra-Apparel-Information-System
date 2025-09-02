const sequelize = require('../config/db');
const JournalEntry = require('../models/JournalEntry');
const JournalEmployee = require('../models/JournalEmployee');

// Create Journal Entry
exports.createJournalEntry = async (req, res) => {
  try {
    const { date, total_items_produced, notes, employees } = req.body;

    const entry = await JournalEntry.create({
      date,
      total_items_produced,
      notes,
      photo_path: req.file ? req.file.path : null
    });

    // employees comes as JSON string → parse first
    const employeeData = JSON.parse(employees);
    for (const emp of employeeData) {
      await JournalEmployee.create({ ...emp, journal_id: entry.id });
    }

    res.json({ success: true, entry });
  } catch (err) {
    console.error('Error creating journal entry:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get Journal Entries (with optional filters)
exports.getJournalEntries = async (req, res) => {
  try {
    const { month, year } = req.query;
    let condition = {};

    if (month && year) {
      condition.date = sequelize.where(
        sequelize.fn('MONTH', sequelize.col('date')),
        month
      );
      // you can also add YEAR condition if needed
    }

    const entries = await JournalEntry.findAll({
      include: [JournalEmployee],
      order: [['date', 'ASC']]
    });

    res.json(entries);
  } catch (err) {
    console.error('Error fetching journal entries:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
