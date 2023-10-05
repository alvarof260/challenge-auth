import mongoose from 'mongoose'

const cartsSchema = new mongoose.Schema({
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

export const cartsDAO = mongoose.model('carts', cartsSchema)
