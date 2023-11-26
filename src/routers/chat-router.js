import { Router } from 'express'
import { privateRoutes } from '../middlewares/auth.js'

const router = Router()

router.get('/', privateRoutes, (req, res) => {
  res.render('chat', { user: req.session.user.email })
})

export default router
