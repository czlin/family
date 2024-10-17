import KoaRouter from 'koa-router'
import controllers from '../controllers'

const router = new KoaRouter()

export default router
  .post('/api/createScore', controllers.score.create)
  .post('/api/updateScore', controllers.score.update)
  .post('/api/deleteScore/:id', controllers.score.remove)
  .get('/api/score', controllers.score.list)
  .get('/api/score/:id', controllers.score.detail)