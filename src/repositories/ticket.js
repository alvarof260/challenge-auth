export default class TicketRepository {
  constructor (dao) {
    this.dao = dao
  }

  get = async () => await this.dao.get()
  getById = async (id) => await this.dao.findById(id)
  create = async (data) => await this.dao.create(data)
  update = async (id, data) => await this.dao.updateOne(id, data)
}
