import { cartsDAO } from '../dao/models/carts.js'
import { productsDAO } from '../dao/models/products.js'
import { getProductsFromCart } from '../services/carts.js'

export const createCart = async (req, res) => {
  try {
    const result = await cartsDAO.create({})
    res.status(201).json({ result })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const getCart = async (req, res) => {
  const result = await getProductsFromCart(req, res)
  res.status(result.statusCode).json(result.response)
}

export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params
    const cartToAdd = await cartsDAO.findById(cid)
    if (cartToAdd === null) return res.json(404).json({ error: `cart ${cid} not found` })
    const product = await productsDAO.findById(pid)
    if (product === null) return res.json(404).json({ error: `product ${pid} not found` })
    const indexProd = cartToAdd.products.findIndex(item => item.product == pid)
    indexProd > -1
      ? cartToAdd.products[indexProd].quantity += 1
      : cartToAdd.products.push({ product: pid, quantity: 1 })
    const result = await cartsDAO.findByIdAndUpdate(cid, cartToAdd, { returnDocument: 'after' })
    res.status(201).json({ result })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const deleteProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params
    const cartToUpdate = await cartsDAO.findById(cid)
    if (cartToUpdate === null) return res.json(404).json({ error: `cart ${cid} not found` })
    const productToDelete = await productsDAO.findById(pid)
    if (productToDelete === null) return res.json(404).json({ error: `product ${pid} not found` })
    const productIndex = cartToUpdate.products.findIndex(item => item.product == pid)
    if (productIndex === -1) {
      return res.status(400).json({ error: `Product ${pid} Not found in Cart ${cid}` })
    } else {
      cartToUpdate.products = cartToUpdate.products.filter(item => item.product.toString() !== pid)
    }
    const result = await cartsDAO.findByIdAndUpdate(cid, cartToUpdate, { returnDocument: 'after' })
    res.status(200).json({ result })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const updateCart = async (req, res) => {
  try {
    const { cid } = req.params
    const cartToUpdate = await cartsDAO.findById(cid)
    if (cartToUpdate === null) {
      return res.status(404).json({ status: 'error', error: `Cart id=${cid} Not found` })
    }
    const { products } = req.body
    if (!products) {
      return res.status(400).json({ status: 'error', error: 'Field "products" is not optional' })
    }
    for (let index = 0; index < products.length; index++) {
      if (!products[index].hasOwnProperty('product') || !products[index].hasOwnProperty('quantity')) {
        return res.status(400).json({ status: 'error', error: 'product must have a valid id and a valid quantity' })
      }
      if (typeof products[index].quantity !== 'number') {
        return res.status(400).json({ status: 'error', error: 'product quantity must be a number' })
      }
      if (products[index].quantity === 0) {
        return res.status(400).json({ status: 'error', error: 'product quantity cannot be 0' })
      }
      const productToAdd = await cartsDAO.findById(products[index].product)
      if (productToAdd === null) {
        return res.status(400).json({ status: 'error', error: `Product id=${products[index].product} doesnot exist. We cannot add this product to the cart id=${cid}` })
      }
    }
    cartToUpdate.products = products
    const result = await cartsDAO.findByIdAndUpdate(cid, cartToUpdate, { returnDocument: 'after' })
    res.status(200).json({ result })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const updateProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params
    const cartToUpdate = await cartsDAO.findById(cid)
    if (cartToUpdate === null) {
      return res.status(404).json({ status: 'error', error: `Cart  id=${cid} Not found` })
    }
    const productToUpdate = await cartsDAO.findById(pid)
    if (productToUpdate === null) {
      return res.status(404).json({ status: 'error', error: `Product  id=${pid} Not found` })
    }
    const quantity = req.body.quantity
    if (!quantity) {
      return res.status(400).json({ status: 'error', error: 'Field "quantity" is not optional' })
    }
    if (typeof quantity !== 'number') {
      return res.status(400).json({ status: 'error', error: 'product quantity must be a number' })
    }
    if (quantity === 0) {
      return res.status(400).json({ status: 'error', error: 'product quantity cannot be 0' })
    }
    const productIndex = cartToUpdate.products.findIndex(item => item.product == pid)
    if (productIndex === -1) {
      return res.status(400).json({ status: 'error', error: `Product  id=${pid} Not found in Cart  id=${cid}` })
    } else {
      cartToUpdate.products[productIndex].quantity = quantity
    }
    const result = await cartsDAO.findByIdAndUpdate(cid, cartToUpdate, { returnDocument: 'after' })
    res.status(200).json({ result })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const deleteCart = async (req, res) => {
  try {
    const { cid } = req.params
    const cartToUpdate = await cartsDAO.findById(cid)
    if (cartToUpdate === null) {
      return res.status(404).json({ status: 'error', error: `Cart id=${cid} Not found` })
    }
    cartToUpdate.products = []
    const result = await cartsDAO.findByIdAndUpdate(cid, cartToUpdate, { returnDocument: 'after' })
    res.status(200).json({ result })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
