import {Router} from 'express'
import {updateCheckItem} from '../check/check.controller.js'
import {validateJwt,isAdmin} from '../middlewares/validate-jwt.js'

const api = Router()

api.put('/updateCheckItem/:id', [validateJwt, isAdmin], updateCheckItem)

export default api