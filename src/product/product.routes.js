import express from 'express'
import { 
    validateJwt,
    isAdmin
} from '../middlewares/validate-jwt.js';
import {
    addP,
    update,
    deleteP,
    findProduct,
    listCate,
    outOfStock,
    bestSellers,
    productsByCategory
} from './product.controller.js';

const api = express.Router();

api.post('/addP', [validateJwt, isAdmin], addP)
api.put('/update/:id', [validateJwt, isAdmin], update)
api.delete('/deleteP/:id', [validateJwt, isAdmin], deleteP)
api.get('/findProduct/:search', findProduct)
api.get('/listCate', listCate)
api.get('/outOfStock', [validateJwt, isAdmin], outOfStock)
api.get('/bestSellers', bestSellers)
api.get('/productsByCategory/:categoryId', productsByCategory)

export default api