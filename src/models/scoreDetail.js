import { Model, DataTypes } from '@sequelize/core';
import { sequelize } from '../db';

class ScoreDetail extends Model {}
ScoreDetail.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  subject: {
    type: DataTypes.STRING,
  },
  fraction: {
    type: DataTypes.INTEGER,
  },
}, {
  sequelize,
  modelName: 'ScoreDetail',
  tableName: 'score_details',
});

export default ScoreDetail;
