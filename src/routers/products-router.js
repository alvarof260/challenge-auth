import { Router } from 'express'
import { createProduct, deleteProduct, getProductByID, getProducts, updateProduct } from '../controllers/product.js'

const router = Router()

router.get('/', getProducts)

router.get('/:id', getProductByID)

router.post('/', createProduct)

router.put('/:id', updateProduct)

router.delete('/:id', deleteProduct)

export default router
