import { cartModel } from '../models/carts.js'
import { productModel } from '../models/products.js'
import { ticketModel } from '../models/ticket.js'
import { ProductService } from '../repositories/index.js'
import shortid from 'shortid'

export const getProductsFromCart = async (req, res) => {
  try {
    const id = req.params.cid
    const result = await cartModel.findById(id).populate('products.product').lean()
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

export const createCart = async (req, res) => {
  try {
    const result = await cartModel.create({})
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
    const cartToAdd = await cartModel.findById(cid)
    if (cartToAdd === null) return res.json(404).json({ error: `cart ${cid} not found` })
    const product = await productModel.findById(pid)
    if (product === null) return res.json(404).json({ error: `product ${pid} not found` })
    const indexProd = cartToAdd.products.findIndex(item => item.product == pid)
    indexProd > -1
      ? cartToAdd.products[indexProd].quantity += 1
      : cartToAdd.products.push({ product: pid, quantity: 1 })
    const result = await cartModel.findByIdAndUpdate(cid, cartToAdd, { returnDocument: 'after' })
    res.status(201).json({ result })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const deleteProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params
    const cartToUpdate = await cartModel.findById(cid)
    if (cartToUpdate === null) return res.json(404).json({ error: `cart ${cid} not found` })
    const productToDelete = await productModel.findById(pid)
    if (productToDelete === null) return res.json(404).json({ error: `product ${pid} not found` })
    const productIndex = cartToUpdate.products.findIndex(item => item.product == pid)
    if (productIndex === -1) {
      return res.status(400).json({ error: `Product ${pid} Not found in Cart ${cid}` })
    } else {
      cartToUpdate.products = cartToUpdate.products.filter(item => item.product.toString() !== pid)
    }
    const result = await cartModel.findByIdAndUpdate(cid, cartToUpdate, { returnDocument: 'after' })
    res.status(200).json({ result })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const updateCart = async (req, res) => {
  try {
    const { cid } = req.params
    const cartToUpdate = await cartModel.findById(cid)
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
      const productToAdd = await cartModel.findById(products[index].product)
      if (productToAdd === null) {
        return res.status(400).json({ status: 'error', error: `Product id=${products[index].product} doesnot exist. We cannot add this product to the cart id=${cid}` })
      }
    }
    cartToUpdate.products = products
    const result = await cartModel.findByIdAndUpdate(cid, cartToUpdate, { returnDocument: 'after' })
    res.status(200).json({ result })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const updateProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params
    const cartToUpdate = await cartModel.findById(cid)
    if (cartToUpdate === null) {
      return res.status(404).json({ status: 'error', error: `Cart  id=${cid} Not found` })
    }
    const productToUpdate = await cartModel.findById(pid)
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
    const result = await cartModel.findByIdAndUpdate(cid, cartToUpdate, { returnDocument: 'after' })
    res.status(200).json({ result })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const deleteCart = async (req, res) => {
  try {
    const { cid } = req.params
    const cartToUpdate = await cartModel.findById(cid)
    if (cartToUpdate === null) {
      return res.status(404).json({ status: 'error', error: `Cart id=${cid} Not found` })
    }
    cartToUpdate.products = []
    const result = await cartModel.findByIdAndUpdate(cid, cartToUpdate, { returnDocument: 'after' })
    res.status(200).json({ result })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const purchase = async (req, res) => {
  try {
    const cid = req.params.cid
    const cartToPurchase = await cartModel.findById(cid)
    if (cartToPurchase === null) {
      return res.status(404).json({ status: 'error', error: `Cart with id=${cid} Not found` })
    }
    const productsToTicket = []
    let productsAfterPurchase = cartToPurchase.products
    let amount = 0
    for (let index = 0; index < cartToPurchase.products.length; index++) {
      const productToPurchase = await ProductService.getById(cartToPurchase.products[index].product)
      if (productToPurchase === null) {
        return res.status(400).json({ status: 'error', error: `Product with id=${cartToPurchase.products[index].product} does not exist. We cannot purchase this product` })
      }
      if (cartToPurchase.products[index].quantity <= productToPurchase.stock) {
        productToPurchase.stock -= cartToPurchase.products[index].quantity
        await ProductService.update(productToPurchase._id, { stock: productToPurchase.stock })
        productsAfterPurchase = productsAfterPurchase.filter(item => item.product.toString() !== cartToPurchase.products[index].product.toString())
        amount += (productToPurchase.price * cartToPurchase.products[index].quantity)
        productsToTicket.push({ product: productToPurchase._id, price: productToPurchase.price, quantity: cartToPurchase.products[index].quantity })
      }
    }
    await cartModel.findByIdAndUpdate(cid, { products: productsAfterPurchase }, { returnDocument: 'after' })
    const result = await ticketModel.create({
      code: shortid.generate(),
      products: productsToTicket,
      amount,
      purchaser: req.session.user.email
    })
    return res.status(201).json({ status: 'success', payload: result })
  } catch (err) {
    return res.status(500).json({ status: 'error', error: err.message })
  }
}
