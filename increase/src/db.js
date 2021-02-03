const Sequelize = require("sequelize");
require('dotenv/config');
const postgresUser = process.env.POSTGRESS_USER
const postgresPass = process.env.POSTGRESS_PASSWORD
const postgresPort = process.env.PORT
function db() {
  return new Sequelize(`postgres://${postgresUser}:${postgresPass}@localhost:${postgresPort}/increase`, {
    logging: false, // set to console.log to see the raw SQL queries
  });
}
    
module.exports = db;
