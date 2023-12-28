import { Product, Ticket } from '../dao/factory.js'
import ProductRepository from './product.js'
import TicketRepository from './ticket.js'

export const ProductService = new ProductRepository(new Product())
export const TicketService = new TicketRepository(new Ticket())
