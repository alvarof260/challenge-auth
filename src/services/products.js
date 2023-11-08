import { productsDAO } from '../dao/models/products'
import cfg from '../config/config.js'

export const getProducts = async (req, res) => {
  try {
    const limit = req.query.limit || await productsDAO.estimatedDocumentCount()
    const page = req.query.page || 1
    const filterOptions = {}
    if (req.query.stock) filterOptions.stock = req.query.stock
    if (req.query.category) filterOptions.category = req.query.category
    const paginateOptions = { lean: true, limit, page }
    if (req.query.sort === 'asc') paginateOptions.sort = { price: 1 }
    if (req.query.sort === 'desc') paginateOptions.sort = { price: -1 }
    const result = await productsDAO.paginate(filterOptions, paginateOptions)
    let prevLink
    if (!req.query.page) {
      prevLink = `http://${req.hostname}:${cfg.PORT}${req.originalUrl}&page=${result.prevPage}`
    } else {
      const modifiedUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${result.prevPage}`)
      prevLink = `http://${req.hostname}:${cfg.PORT}${modifiedUrl}`
    }
    let nextLink
    if (!req.query.page) {
      nextLink = `http://${req.hostname}:${cfg.PORT}${req.originalUrl}&page=${result.nextPage}`
    } else {
      const modifiedUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${result.nextPage}`)
      nextLink = `http://${req.hostname}:${cfg.PORT}${modifiedUrl}`
    }
    return {
      statusCode: 200,
      response: {
        status: 'success',
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? prevLink : null,
        nextLink: result.hasNextPage ? nextLink : null
      }
    }
  } catch (err) {
    return {
      statusCode: 500,
      response: { status: 'error', error: err.message }
    }
  }
}
