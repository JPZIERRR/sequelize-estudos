const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    dialect: 'postgres',
  },
);

try {
  sequelize.authenticate();
  console.log('banco conectado!!');
} catch (err) {
  console.log('Aconteceu um erro!' + err);
}

module.exports = sequelize;
