import Score from '../models/score';
import ScoreDetail from '../models/scoreDetail';

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
      id: ctx.request.body.id,
    },
    include: ScoreDetail,
  })

  await score.update(ctx.request.body.data, {
    include: ScoreDetail,
  })

  next()
}

export const remove = async (ctx, next) => {
  const score = await Score.findOne({
    where: {
      id: ctx.request.body.id,
    },
  });
  await score.destroy();

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
  });

  next()
}