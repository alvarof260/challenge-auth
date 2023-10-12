import { Router } from 'express'
import passport from 'passport'

const router = Router()

router.post('/login', passport.authenticate('login', { failureRedirect: '/' }), async (req, res) => {
  if (!req.user) {
    return res.status(400).send({ error: 'invalid credentials' })
  }
  req.session.user = {
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
    age: req.user.age
  }
  res.redirect('/products')
})

router.post('/register', passport.authenticate('register', { failureRedirect: '/register' }), async (req, res) => {
  res.redirect('/')
})

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), (req, res) => {

})

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
  console.log(req.user)
  req.session.user = req.user
  res.redirect('/products')
})
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err)
      res.redirect('/products')
    } else {
      res.redirect('/')
    }
  }
  )
})

export default router
