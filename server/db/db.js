const Sequelize = require("sequelize");

const db = new Sequelize(process.env.DATABASE_URL || "postgres://messenger_dev:password@localhost:5432/messenger", {
  logging: false
});

module.exports = db;
