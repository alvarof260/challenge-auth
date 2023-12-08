import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import bcrypt from 'bcrypt'
import { fakerES } from '@faker-js/faker'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

export const generateProducts = () => {
  return {
    _id: fakerES.database.mongodbObjectId(),
    title: fakerES.commerce.productName(),
    description: fakerES.commerce.productDescription(),
    price: fakerES.commerce.price({ min: 10, max: 150 }),
    code: fakerES.commerce.productAdjective(),
    category: fakerES.commerce.department(),
    stock: fakerES.number.int({ max: 100 }),
    thumbnail: fakerES.image.avatar(({ height: 480, width: 640 }))
  }
}
