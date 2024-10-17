import Score from '../models/score';
import ScoreDetail from '../models/scoreDetail';

export const Get = async (ctx, next) => {
  const score = await Score.create({
    title: '测试2',
    term: '第二学期',
    name: 'LMF',
    scoreDetails: [{
      subject: 'YY',
      fraction: '19',
    }, {
      subject: 'SX',
      fraction: '56',
    }]
  }, {
    include: ScoreDetail,
  });
  // await score.addScoreDetails([{
  //   subject: 'YY',
  //   fraction: '19',
  // }, {
  //   subject: 'SX',
  //   fraction: '56',
  // }])

  ctx.body = {
    result: 'get',
    name: ctx.params.name,
    para: ctx.query
  }

  next()
}

export const Post = async (ctx, next) => {
  const score = await Score.create(ctx.request.body, {
    include: ScoreDetail,
  });

  ctx.body = {
    result: 'post',
    name: ctx.params.name,
    para: ctx.request.body
  }

  next()
}

export const Put = (ctx, next) => {
  ctx.body = {
    result: 'put',
    name: ctx.params.name,
    para: ctx.request.body
  }

  next()
}

export const Delete = (ctx, next) => {
  ctx.body = {
    result: 'delete',
    name: ctx.params.name,
    para: ctx.request.body
  }

  next()
}