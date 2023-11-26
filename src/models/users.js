import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  age: { type: Number, required: true },
  role: { type: String, default: 'user' },
  password: { type: String, required: true },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts' }
})

export const userModel = mongoose.model('users', userSchema)
