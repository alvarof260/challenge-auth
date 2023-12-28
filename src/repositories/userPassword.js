export default class UserPasswordRepository {
  constructor (dao) {
    this.dao = dao
  }

  getAll = async () => await this.dao.getAllSols()
  getById = async (id) => await this.dao.getSolById(id)
  create = async (data) => await this.dao.createSol(data)
  update = async (id, data) => await this.dao.updateSol(id, data)
  delete = async (id) => await this.dao.deleteSol(id)
  findOne = async (data) => await this.dao.findOne(data)
}
