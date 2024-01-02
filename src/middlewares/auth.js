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

export const handlePolicies = policies => (req, res, next) => {
  logger.info(JSON.stringify(req.session.user))
  if (policies.includes('PUBLIC')) return next()
  if (!req.session.user) return res.status(401).json({ status: 'error', error: 'You are not logged-in' })
  if (policies.length > 0) {
    if (!policies.includes(req.session.user.role.toUpperCase())) {
      return res.status(403).json({ status: 'error', error: 'You are not authorized' })
    }
  }
  next()
}
