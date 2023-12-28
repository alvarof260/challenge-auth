import cfg from '../config/config.js'

export let Product
export let Ticket

switch (cfg.config.PERSISTENCE) {
  case 'MONGO':
    const { default: ProductMongo } = await import('./product-mongo.js')
    const { default: TicketMongo } = await import('./ticket.js')
    
    Product = ProductMongo
    Ticket = TicketMongo
    break

  default:
    break
}
