import { Router } from 'express'
import { handlePolicies } from '../middlewares/auth.js'
import { createProduct, deleteProduct, getProductByID, getProducts, updateProduct } from '../controllers/product.js'

const router = Router()

router.get('/', handlePolicies(['USER', 'ADMIN']), getProducts)

router.get('/:id', handlePolicies(['USER', 'ADMIN']), getProductByID)

router.post('/', handlePolicies(['ADMIN', 'PREMIUM']), createProduct)

router.put('/:id', handlePolicies(['ADMIN', 'PREMIUM']), updateProduct)

router.delete('/:id', handlePolicies(['ADMIN', 'PREMIUM']), deleteProduct)

export default router
