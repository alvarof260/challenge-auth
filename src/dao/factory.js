import cfg from '../config/config.js'

export let product

switch (cfg.config.PERSISTENCE) {
  case 'MONGO':
    const { default: ProductMongo } = await import('./product-mongo.js')
    product = ProductMongo
    break

  default:
    break
}
