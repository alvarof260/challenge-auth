import { ticketModel } from '../models/ticket.js'
export default class ticketMongo {
  get = async () => await ticketModel.find().lean().exec()
  getById = async (id) => await ticketModel.findById(id)
  create = async (data) => await ticketModel.create(data)
  update = async (id, data) => await ticketModel.updateOne(id, data)
}
