import Score from '../models/score';
import ScoreDetail from '../models/scoreDetail';

Score.hasMany(ScoreDetail);

ScoreDetail.belongsTo(Score);

Score.sync()
ScoreDetail.sync()
