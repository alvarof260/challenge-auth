import logger from '../config/logger.js'

export const privateRoutes = (req, res, next) => {
  if (req.session?.user) {
    next()
  } else {
    logger.info('redirect')
    res.redirect('/')
  }
}

export const publicRoutes = (req, res, next) => {
  if (!req.session.user) return res.redirect('/')
  next()
}
