export const login = async (req, res) => {
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
}

export const register = async (req, res) => {
  res.redirect('/')
}
export const github = (req, res) => {

}

export const githubcallback = (req, res) => {
  req.session.user = req.user
  res.redirect('/products')
}

export const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      res.redirect('/products')
    } else {
      res.redirect('/')
    }
  }
  )
}
