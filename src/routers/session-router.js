import { Router } from 'express'
import passport from 'passport'
import { github, githubcallback, login, logout, register, forgetPassword, verifyCode, resetPassword } from '../controllers/session.js'

const router = Router()

router.post('/login', passport.authenticate('login', { failureRedirect: '/' }), login)

router.post('/register', passport.authenticate('register', { failureRedirect: '/register' }), register)

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), github)

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/' }), githubcallback)

router.get('/logout', logout)

router.post('/forget-password', forgetPassword)

router.get('/verify-code/:code', verifyCode)

router.post('/reset-password/:email/code/:code', resetPassword)

export default router
