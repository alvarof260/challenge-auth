import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import __dirname from './utils.js'
import { messageModel } from './dao/models/message.js'
import productRouter from './routers/products-router.js'
import cartRouter from './routers/carts-router.js'
import viewRouter from './routers/views-router.js'
import chatRouter from './routers/chat-router.js'
import sessionRouter from './routers/session-router.js'
import sessionViewRouter from './routers/views-session-router.js'
import { initializePassport } from './config/passport.js'
import passport from 'passport'
import cfg from './config/config.js'

export const PORT = cfg.PORT
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))
app.use(session({
  store: MongoStore.create({
    mongoUrl: cfg.MONGO_DB_URL,
    dbName: cfg.MONGO_DB_NAME
  }),
  secret: cfg.SESSION_SIGN,
  resave: false,
  saveUninitialized: false
}))
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

try {
  await mongoose.connect(cfg.MONGO_CONNECT, {
    dbName: cfg.MONGO_DB_NAME
  })
  console.log('db connect')
  const httpServer = app.listen(PORT, () => {
    console.log(`listen on http://localhost:${PORT}`)
  })
  const socketServer = new Server(httpServer)
  socketServer.on('connection', async socketClient => {
    console.log('nuevo cliente conectado')
    socketClient.on('productList', data => {
      socketServer.emit('updatedProducts', data)
    })
    const messages = await messageModel.find().lean().exec()
    socketClient.emit('history', messages)
    socketClient.on('message', async data => {
      await messageModel.create(data)
      const messages = await messageModel.find().lean().exec()
      socketServer.emit('history', messages)
    })
  })
  app.use('/api/products', productRouter)
  app.use('/api/carts', cartRouter)
  app.use('/api/session', sessionRouter)
  app.use('/products', viewRouter)
  app.use('/chat', chatRouter)
  app.use('/', sessionViewRouter)
} catch (err) {
  console.log(err.message)
  process.exit(-1)
}
