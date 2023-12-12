import dotenv from 'dotenv'

dotenv.config()

export default {
  config: {
    PORT: process.env.PORT,
    SESSION_SIGN: process.env.SESSION_SIGN,
    PERSISTENCE: process.env.PERSISTENCE,
    ENVIROMENT: process.env.ENVIROMENT
  },
  mongo: {
    MONGO_DB_NAME: process.env.MONGO_DB_NAME,
    ADMIN_USER: process.env.ADMIN_USER,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    MONGO_DB_URL: process.env.MONGO_DB_URL,
    MONGO_CONNECT: process.env.MONGO_CONNECT
  }
}
