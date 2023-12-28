/* eslint-disable no-case-declarations */
import cfg from '../config/config.js'

export let Product
export let Ticket
export let UserPassword
export let User

switch (cfg.config.PERSISTENCE) {
  case 'MONGO':
    const { default: ProductMongo } = await import('./product-mongo.js')
    const { default: TicketMongo } = await import('./ticket.js')
    const { default: UserPasswordMongo } = await import('./userPassword.js')
    const { default: UserMongo } = await import('./user.js')
    Product = ProductMongo
    Ticket = TicketMongo
    UserPassword = UserPasswordMongo
    User = UserMongo
    break

  default:
    break
}
