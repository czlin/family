import { Sequelize, DataTypes } from '@sequelize/core';
import { DB } from '../config';

const sequelize = new Sequelize(DB.database, DB.username, DB.password, {
  host: DB.host,
  dialect: 'mysql'
});

const Score = sequelize.define('Score', {
  // 在这里定义模型属性
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING
    // allowNull 默认为 true
  }
}, {
  // 这是其他模型参数
});

try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

export {
  sequelize
};
