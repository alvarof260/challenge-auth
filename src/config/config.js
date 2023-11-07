import dotenv from 'dotenv'

dotenv.config()

export default {
  PORT: process.env.PORT,
  MONGO_DB_NAME: process.env.MONGO_DB_NAME,
  ADMIN_USER: process.env.ADMIN_USER,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  MONGO_DB_URL: process.env.MONGO_DB_URL,
  SESSION_SIGN: process.env.SESSION_SIGN,
  MONGO_CONNECT: process.env.MONGO_CONNECT
}
