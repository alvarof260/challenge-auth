import mongoose from 'mongoose'

const usersSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  age: Number,
  password: String,
  role: String
})

export const userDAO = mongoose.model('users', usersSchema)
