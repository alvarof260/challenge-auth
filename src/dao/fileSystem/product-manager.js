import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'

export class ProductManager {
  #path
  constructor (path) {
    this.#path = path
    this.#init()
  }

  async #init () {
    if (!existsSync(this.#path)) {
      await writeFile(this.#path, JSON.stringify([], null, '/t'))
    }
  }

  async getProducts () {
    try {
      const res = await readFile(this.#path, 'utf-8')
      return JSON.parse(res)
    } catch (err) {
      throw new Error(err)
    }
  }

  async addProduct (product) {
    let response
    try {
      response = await this.getProducts()
    } catch (err) {
      console.log(err)
      return []
    }
    const found = response.find(el => el.code === product.code)
    if (found) return
    const id = this.generatorID(response)
    response.push({ id, ...product })
    try {
      await writeFile(this.#path, JSON.stringify(response, null, '\t'))
      return response
    } catch (err) {
      console.log(err)
      return []
    }
  }

  generatorID (products) {
    if (products.length === 0) return 1
    return products[products.length - 1].id + 1
  }

  async getProductByID (idProd) {
    try {
      const products = await this.getProducts()
      const product = products.find((el) => el.id === parseInt(idProd))
      return product
    } catch (err) {
      throw new Error(err)
    }
  }

  async productUpdate (itemId, updatedProduct) {
    const products = await this.getProducts()
    const productsUpdates = products.map(item => {
      if (item.id === parseInt(itemId)) {
        return { ...item, ...updatedProduct }
      } else {
        return item
      }
    })
    await writeFile(this.#path, JSON.stringify(productsUpdates, null, '\t'))
    return productsUpdates.find(el => el.id === parseInt(itemId))
  }

  async productDelete (itemId) {
    const products = await this.getProducts()
    const found = products.find(el => el.id === parseInt(itemId))
    if (!found) return
    const position = products.findIndex(el => el.id === parseInt(itemId))
    const productsUpdates = products.splice(position, 1)
    await writeFile(this.#path, JSON.stringify(products, null, '\t'))
    return productsUpdates
  }
}

/* const productManager = new ProductManager('products.json')

const test = async () => {
  console.log('---------------!----------------')
  console.log(await productManager.getProducts())

  console.log('---------------!----------------')
  console.log(await productManager.addProduct({ title: 'sin titulo', description: 'sin desc.', price: 250, thumbnail: 'no imagen', code: 'b0452', stock: 10 }))

  console.log('---------------!----------------')
  console.log(await productManager.getProducts())

  console.log('---------------!----------------')
  console.log(await productManager.addProduct({ title: 'sin titulo', description: 'sin desc.', price: 250, thumbnail: 'no imagen', code: 'b0452', stock: 10 }))

  console.log('---------------!----------------')
  console.log(await productManager.getProducts())

  console.log('---------------!----------------')
  console.log(await productManager.addProduct({ title: 'sin titulo', description: 'sin desc.', price: 35000, thumbnail: 'no imagen', code: 'b5452', stock: 15 }))

  console.log('---------------!----------------')
  console.log(await productManager.getProducts())

  console.log('---------------!----------------')
  console.log(await productManager.getProductByID(1))

  console.log('---------------!----------------')
  console.log(await productManager.productUpdate(1, { title: 'titulo cappoooo!' }))

  console.log('---------------!----------------')
  console.log(await productManager.productDelete(1))

  console.log('---------------!----------------')
  console.log(await productManager.getProducts())
}

test() */
