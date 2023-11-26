import { Router } from 'express'
import { createCart, getCart, addProductToCart, deleteProductToCart, updateCart, updateProductFromCart, deleteCart, purchase } from '../controllers/cart.js'

const router = Router()

router.post('/', createCart)

router.get('/:cid', getCart)

router.post('/:cid/product/:pid', addProductToCart)

router.delete('/:cid/product/:pid', deleteProductToCart)

router.put('/:cid', updateCart)

router.put('/:cid/product/:pid', updateProductFromCart)

router.delete('/:cid', deleteCart)

router.get('/:cid/purchase', purchase)

export default router
