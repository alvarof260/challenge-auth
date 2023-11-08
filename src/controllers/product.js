import { productsDAO } from '../dao/models/products.js'
import { getProducts } from '../services/products.js'
import cfg from '../config/config.js'

export const getProducts = async (req, res) => {
  const result = await getProducts(req, res)
  res.status(result.statusCode).json(result.response)
}

export const getProductByID = async (req, res) => {
  try {
    const id = req.params.id
    const result = await productsDAO.findById(id).lean().exec()
    if (result === null) return res.status(404).json({ status: 'error', error: 'Not Found' })
    res.status(200).json(result)
  } catch (err) {
    res.status(404).json({ status: 'error', error: err.message })
  }
}

export const createProduct = async (req, res) => {
  try {
    const product = req.body
    const result = await productsDAO.create(product)
    res.status(201).json({ result })
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message })
  }
}

export const updateProduct = async (req, res) => {
  try {
    const id = req.params.id
    const data = req.body
    const result = await productsDAO.findByIdAndUpdate(id, data, { returnDocument: 'after' })
    if (result === null) return res.status(404).json({ status: 'error', error: 'Not Found' })
    res.status(200).json({ result })
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message })
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id
    const result = await productsDAO.findByIdAndDelete(id, { returnDocument: 'after' })
    if (result === null) return res.status(404).json({ status: 'error', error: 'Not Found' })
    res.status(200).json({ result })
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message })
  }
}

export const viewProducts =  async (req, res) => {
  const user = req.session.user
  const result = await getProducts(req, res)
  if (result.statusCode === 200) {
    const totalPages = []
    let link
    for (let index = 1; index <= result.response.totalPages; index++) {
      if (!req.query.page) {
        link = `http://${req.hostname}:${cfg.PORT}${req.originalUrl}&page=${index}`
      } else {
        const modifiedUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${index}`)
        link = `http://${req.hostname}:${cfg.PORT}${modifiedUrl}`
      }
      totalPages.push({ page: index, link })
    }
    res.render('home', {
      user,
      products: result.response.payload,
      paginateInfo: {
        hasPrevPage: result.response.hasPrevPage,
        hasNextPage: result.response.hasNextPage,
        prevLink: result.response.prevLink,
        nextLink: result.response.nextLink,
        totalPages
      }

    })
  } else {
    res.status(result.statusCode).json({ status: 'error', error: result.response.error })
  }
}

export const viewProductsRealTime =  async (req, res) => {
  const result = await getProducts(req, res)
  if (result.statusCode === 200) {
    res.render('realTimeProducts', { products: result.response.payload })
  } else {
    res.status(result.statusCode).json({ status: 'error', error: result.response.error })
  }
}