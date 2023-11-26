import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema({
  id: Number,
  products: {
    type: [{
      _id: false,
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
      },
      quantity: Number
    }],
    default: []
  }
})

export const cartModel = mongoose.model('carts', cartSchema)
