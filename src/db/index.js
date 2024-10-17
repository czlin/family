import { Sequelize } from '@sequelize/core';
import { DB } from '../config';

const sequelize = new Sequelize({
  database: DB.database,
  user: DB.username,
  password: DB.password,
  host: DB.host,
  port: DB.port,
  dialect: 'mysql'
});

try {
  sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
    require('./model');
    
  }).catch((error) => {
    console.error('Unable to connect to the database:', error);  
  });
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

export {
  sequelize
};
