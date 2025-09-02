const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const JournalEntry = sequelize.define('JournalEntry', {
  date: { type: DataTypes.DATEONLY, allowNull: false },
  total_items_produced: { type: DataTypes.INTEGER, allowNull: false },
  notes: { type: DataTypes.TEXT },
  photo_path: { type: DataTypes.STRING }
});

module.exports = JournalEntry;
