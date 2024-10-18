import Score from '../models/score';
import ScoreDetail from '../models/scoreDetail';
import { sequelize } from '../db';

export const create = async (ctx, next) => {
  try {
    await Score.create(ctx.request.body, {
      include: ScoreDetail,
    });
  }
  catch (err) {
    console.log(err);
  }

  ctx.body = {
    code: 0,
    msg: 'success',
  }

  next()
}

export const update = async (ctx, next) => {
  const score = await Score.findOne({
    where: {
      id: ctx.params.id,
    },
    include: ScoreDetail,
  })

  const details = [];
  (ctx.request.body.scoreDetails || []).forEach((item) => {
    if (!item.id) {
      item.scoreId = ctx.params.id;
    }

    details.push(item);
  })


  // score.scoreDetails = ctx.request.body.scoreDetails;

  try {
    await sequelize.transaction(async (updateTransaction) => {
      await score.update(ctx.request.body, { transaction: updateTransaction });
    
      await ScoreDetail.bulkCreate(details, { updateOnDuplicate: ['subject', 'fraction'], transaction: updateTransaction })
    });

    ctx.body = {
      code: 0,
      msg: 'success',
    }
  }
  catch(err) {
    console.log(err);

    ctx.body = {
      code: 1000,
      msg: '更新失败',
    }
  }

  next()
}

export const remove = async (ctx, next) => {
  const score = await Score.findOne({
    where: {
      id: ctx.params.id,
    },
  });
  await score.destroy();

  ctx.body = {
    code: 0,
    msg: 'success',
  }

  next()
}

export const list = async (ctx, next) => {
  const filter = ctx.request.query.filter || {};
  let where = {};
  if (filter && 'string' === typeof filter) {
    try {
      where = JSON.parse(filter);
    }
    catch (err) {
      console.log(err);
    }
  }
  
  const list = await Score.findAll({
    where,
    order: [['id', 'DESC']],
    include: ScoreDetail,
    limit: 20,
  });

  ctx.body = {
    code: 0,
    msg: 'success',
    data: list,
  }

  next()
}

export const detail = async (ctx, next) => {
  const score = await Score.findOne({
    where: {
      id: ctx.params.id,
    },
    include: ScoreDetail,
  });

  ctx.body = {
    code: 0,
    msg: 'success',
    data: score,
  }

  next()
}