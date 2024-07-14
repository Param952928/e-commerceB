const { DataTypes } = require("sequelize");
const sequelize = require("../connection/database");

const Product = sequelize.define("users", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
  role: {
    type: DataTypes.ENUM("user", "superadmin"),
    defaultValue: "user",
    allowNull: false,
  },
});

module.exports = Product;
