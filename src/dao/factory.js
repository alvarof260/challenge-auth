import cfg from '../config/config.js'

export let Product

switch (cfg.config.PERSISTENCE) {
  case 'MONGO':
    const { default: ProductMongo } = await import('./product-mongo.js')
    Product = ProductMongo
    break

  default:
    break
}
