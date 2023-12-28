import { Router } from 'express'
import { handlePolicies, privateRoutes } from '../middlewares/auth.js'
import { viewProducts, viewProductsRealTime } from '../controllers/view.js'

const router = Router()

router.get('/', privateRoutes, handlePolicies(['USER', 'ADMIN', 'PREMIUM']), viewProducts)

router.get('/realTimeProducts', privateRoutes, handlePolicies(['ADMIN', 'PREMIUM']), viewProductsRealTime)

export default router
