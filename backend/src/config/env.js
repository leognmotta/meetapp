require('dotenv').config({ path: '.env' });

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,

  // Auth configs
  SECRET: process.env.SECRET,
  EXPIRES_IN: process.env.EXPIRES_IN,

  // DATABASE
  DB_DIALECT: process.env.DB_DIALECT,
  DB_HOST: process.env.DB_HOST,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
};
