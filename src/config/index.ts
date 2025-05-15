import { Sequelize } from 'sequelize';
import logger from './log';
import dotenv from 'dotenv';

const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${env}` });

const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASS!,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    // logging: (msg) => {
    //   logger.info(msg);
    // },
    dialectOptions: {
      multipleStatements: true,
    },
    pool: {
      max: 100,
      min: 1,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export default sequelize;
