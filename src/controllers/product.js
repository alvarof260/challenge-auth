import { ProductService } from '../repositories/index.js'
import EErros from '../services/errors/enums.js'
import CustomError from '../services/errors/custom-error.js'
import { generateErrorInfo } from '../services/errors/message.js'

export const getProducts = async (req, res) => {
  const result = await ProductService.getAllPaginate(req, res)
  res.status(result.statusCode).json(result.response)
}

export const getProductByID = async (req, res) => {
  try {
    const id = req.params.id
    const result = await ProductService.getById(id)
    if (result === null) return res.status(404).json({ status: 'error', error: 'Not Found' })
    res.status(200).json(result)
  } catch (err) {
    res.status(404).json({ status: 'error', error: err.message })
  }
}

export const createProduct = async (req, res) => {
  try {
    const product = req.body

    if (!product.title || !product.description || !product.price || !product.code || !product.category || !product.stock || !product.thumbnail) {
      const error = CustomError.createError({
        name: 'ERROR EN LA CREACIÓN DEL PRODUCTO',
        cause: generateErrorInfo(product),
        message: 'El producto no se pudo crear debido a que faltan propiedades.',
        code: EErros.INVALID_TYPES_ERROR
      })
      return res.status(400).send(error.cause)
    } else {
      const result = await ProductService.create(product)
      res.status(201).json({ result })
    }
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message })
  }
}

export const updateProduct = async (req, res) => {
  try {
    const id = req.params.id
    const data = req.body
    const result = await ProductService.update(id, data, { returnDocument: 'after' })
    if (result === null) return res.status(404).json({ status: 'error', error: 'Not Found' })
    res.status(200).json({ result })
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message })
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id
    const result = await ProductService.delete(id, { returnDocument: 'after' })
    if (result === null) return res.status(404).json({ status: 'error', error: 'Not Found' })
    res.status(200).json({ result })
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message })
  }
}
