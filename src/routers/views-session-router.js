import { Router } from 'express'
import { handlePolicies } from '../middlewares/auth'

const router = Router()

router.get('/', handlePolicies('PUBLIC'), (req, res) => {
  res.render('login')
})

router.get('/register', handlePolicies('PUBLIC'), (req, res) => {
  res.render('register')
})

router.get('/forget-password', (req, res) => {
  res.render('forget-password')
})

router.get('/reset-password/:code', async (req, res) => {

})

export default router
