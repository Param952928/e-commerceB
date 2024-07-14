const { DataTypes } = require('sequelize');
const sequelize = require('../connection/database');

const Category = sequelize.define('category', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  image: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive'),
    defaultValue: 'Active',
  },
  type: {
    type: DataTypes.STRING,
  },
  subType: {
    type: DataTypes.STRING,
  },
});

module.exports = Category;
