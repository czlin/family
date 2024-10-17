import { Model, DataTypes } from '@sequelize/core';
import { sequelize } from '../db';

class Score extends Model {}
Score.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
  },
  term: {
    type: DataTypes.STRING,
  },
  name: {
    type: DataTypes.STRING,
  },
}, {
  sequelize,
  modelName: 'Score',
  tableName: 'scores',
});

export default Score;
