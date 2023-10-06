import { Router } from 'express'
import { userDAO } from '../dao/models/users.js'
const router = Router()

router.post('/login', async (req, res) => {
  const { firstName, password } = req.body
  const user = await userDAO.findOne({ firstName, password })
  if (!user) {
    console.log('no pasaste pa!')
    return res.redirect('/')
  }
  if (user.email === 'adminCoder@coder.com' && user.password === 'adminCod3r123') {
    user.role = 'admin'
  } else {
    user.role = 'user'
  }
  req.session.user = user
  res.redirect('/products')
})

router.post('/register', async (req, res) => {
  const userToRegister = req.body
  await userDAO.create(userToRegister)
  res.redirect('/')
})

export default router
