import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'

import __dirname from './utils.js'
import { messageModel } from './models/message.js'
import productRouter from './routers/products-router.js'
import cartRouter from './routers/carts-router.js'
import viewRouter from './routers/views-router.js'
import chatRouter from './routers/chat-router.js'
import sessionRouter from './routers/session-router.js'
import sessionViewRouter from './routers/views-session-router.js'
import mockingRouter from './routers/mocking-router.js'
import loggerRouter from './routers/logger-router.js'
import { initializePassport } from './config/passport.js'
import cfg from './config/config.js'
import logger from './config/logger.js'

export const PORT = cfg.config.PORT
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))
app.use(session({
  store: MongoStore.create({
    mongoUrl: cfg.mongo.MONGO_DB_URL,
    dbName: cfg.mongo.MONGO_DB_NAME
  }),
  secret: cfg.config.SESSION_SIGN,
  resave: false,
  saveUninitialized: false
}))
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

try {
  await mongoose.connect(cfg.mongo.MONGO_DB_URL, {
    dbName: cfg.mongo.MONGO_DB_NAME
  })
  logger.info('db connect')
  const httpServer = app.listen(PORT, () => {
    logger.info(`listen on http://localhost:${PORT}`)
  })
  const socketServer = new Server(httpServer)
  socketServer.on('connection', async socketClient => {
    logger.info('nuevo cliente conectado')
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
  app.use('/mockingproducts', mockingRouter)
  app.use('/loggerTest', loggerRouter)
} catch (err) {
  logger.error(err.message)
  process.exit(-1)
}
