import KoaRouter from 'koa-router'
import controllers from '../controllers'

const router = new KoaRouter()

export default router
  .post('/api/createScore', controllers.score.create)
  .post('/api/updateScore/:id', controllers.score.update)
  .get('/api/score/:id/delete', controllers.score.remove)
  .get('/api/score', controllers.score.list)
  .get('/api/score/:id', controllers.score.detail)