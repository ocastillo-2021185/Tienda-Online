import { Router } from "express";
import {add} from "./cart.controller.js";
import {validateJwt } from '../middlewares/validate-jwt.js'

const api = Router()

api.post('/add', [validateJwt], add)

export default api