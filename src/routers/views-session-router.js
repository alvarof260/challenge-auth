import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.render('login')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.get('/forget-password', (req, res) => {
  res.render('forget-password')
})

export default router
