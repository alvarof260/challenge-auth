import mongoose from 'mongoose'

const userPasswordSchema = new mongoose.Schema({
  email: { type: String, ref: 'users' },
  code: { type: String, required: true },
  isUsed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expires: 3600 }
})

export const userPasswordModel = mongoose.model('userPassword', userPasswordSchema)
