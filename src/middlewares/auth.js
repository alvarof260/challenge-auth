export const privateRoutes = (req, res, next) => {
  if (req.session?.user) {
    next()
  } else {
    console.log('redirect')
    res.redirect('/')
  }
}

export const publicRoutes = (req, res, next) => {
  if (!req.session.user) return res.redirect('/')
  next()
}
