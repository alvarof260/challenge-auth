import { Product, Ticket, UserPassword, User } from '../dao/factory.js'
import ProductRepository from './product.js'
import TicketRepository from './ticket.js'
import UserPasswordRepository from './userPassword.js'
import UserRepository from './user.js'

export const ProductService = new ProductRepository(new Product())
export const TicketService = new TicketRepository(new Ticket())
export const UserPasswordService = new UserPasswordRepository(new UserPassword())
export const UserService = new UserRepository(new User())
