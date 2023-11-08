import { cartsDAO } from '../dao/models/carts'

export const getProductsFromCart = async (req, res) => {
  try {
    const id = req.params.cid
    const result = await cartsDAO.findById(id).populate('products.product').lean()
    if (result === null) return res.status(404).json({ error: 'Cart Not Found' })
    return {
      statusCode: 200,
      response: { result }
    }
  } catch (err) {
    return {
      statusCode: 500,
      response: { error: err.message }
    }
  }
}
