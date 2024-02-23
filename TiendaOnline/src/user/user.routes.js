import express from 'express'
import { 
    validateJwt,
    isAdmin
} from '../middlewares/validate-jwt.js';
import {
    test,
    registerUser, 
    login, 
    updateUser, 
    deleteU
} from './user.controller.js';

const api = express.Router();

//RUTAS PÚBLICAS
api.post('/registerUser', registerUser)
api.post('/login', login)

//RUTAS PRIVADAS (solo usuarios logeados)
                  //Middleware
api.get('/test', [validateJwt, isAdmin], test)
api.put('/updateUser/:id', [validateJwt], updateUser) //Middleware -> funciones intermedias que sirven para validar.
api.delete('/delete/:id', [validateJwt], deleteU)

export default api