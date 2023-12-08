import { Router } from 'express'
import { generateProducts } from '../utils.js'

const router = Router()

router.get('/', async (req, res) => {
  const fakerProducts = []
  for (let i = 0; i <= 50; i++) {
    fakerProducts.push(generateProducts())
  }
  res.send({ status: 'success', payload: fakerProducts })
})

export default router
