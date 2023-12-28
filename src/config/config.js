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
    MONGO_DB_URL: process.env.MONGO_DB_URL
  },
  nodemailer: {
    NODEMAILER_MAIL: process.env.NODEMAILER_MAIL,
    NODEMAILER_PASSWORD: process.env.NODEMAILER_PASSWORD
  }
}
