import { userPasswordModel } from '../models/userPassword.js'

export default class UserPasswordMongo {
  getAllSols = async () => await userPasswordModel.find().lean().exec()
  getSolById = async (id) => await userPasswordModel.findById(id).lean().exec()
  createSol = async (data) => await userPasswordModel.create(data)
  updateSol = async (id, data) =>
    await userPasswordModel.findByIdAndUpdate(id, data, {
      returnDocument: 'after'
    })

  deleteSol = async (id) => await userPasswordModel.findByIdAndDelete(id)
  findOne = async (data) => await userPasswordModel.findOne(data).lean().exec()
}
