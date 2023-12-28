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

export const forgetPassword = async (req, res) => {
  const email = req.body.email

  const user = await UserService.findOne({ email })
  if (!user) {
    return res.status(404).json({ status: 'error', error: 'User does not found' })
  }
  const code = generateRandomCode()

  await CPSService.create({ email, code })

  const mailerConfig = {
    service: 'gmail',
    auth: { user: cfg.NODEMAILER_EMAIL, pass: cfg.NODEMAILER_PASSWORD },
    tls: { rejectUnauthorized: false }
  }
  const transporter = nodemailer.createTransport(mailerConfig)
  const message = {
    from: cfg.NODEMAILER_EMAIL,
    to: email,
    subject: '[ecommerce] Reset your password',
    html: `<h1>[Coder e-comm API] Reset your password</h1><hr />You have asked to reset your password. You can do it here: <a href="http://${req.hostname}:${cfg.PORT}/api/sessions/CPS/verify-code/${code}">http://${req.hostname}:${cfg.PORT}/api/sessions/CPS/verify-code/${code}</a><hr />Best regards,<br><strong>e-commerce team</strong>`
  }
  try {
    await transporter.sendMail(message)
    return res.json({ status: 'success', message: `Email successfully sent to ${email} in order to reset password` })
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message })
  }
}
