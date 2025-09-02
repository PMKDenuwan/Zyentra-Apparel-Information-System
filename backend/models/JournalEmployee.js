const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const JournalEntry = require('./JournalEntry');

const JournalEmployee = sequelize.define('JournalEmployee', {
  employee_id: { type: DataTypes.INTEGER, allowNull: true },
  employee_name: { type: DataTypes.STRING, allowNull: false },
  hours_worked: { type: DataTypes.FLOAT, allowNull: false },
  items_produced: { type: DataTypes.INTEGER, allowNull: false },
  family_contribution: { type: DataTypes.ENUM('Owner','Husband','Daughter','None'), defaultValue:'None' }
});

// Relationship
JournalEntry.hasMany(JournalEmployee, { foreignKey: 'journal_id', onDelete: 'CASCADE' });
JournalEmployee.belongsTo(JournalEntry, { foreignKey: 'journal_id' });

module.exports = JournalEmployee;
