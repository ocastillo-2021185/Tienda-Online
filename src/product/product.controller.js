'use strict'

import Category from '../category/category.model.js'
import Product from '../product/product.model.js'
import mongoose from 'mongoose';

export const addP = async (req, res)=>{
    try {
        let data = req.body
        let category = await Category.findOne({ _id: data.category })
        if (!category) return res.status(404).send({ message: 'The category was not found' })
        let product = new Product(data)
        await product.save()
        return res.send({ message: 'The new product was saved' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Umm something was wrong' })
    }
}

export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedFields = req.body;
        const updatedProduct = await Product.findOneAndUpdate(
            { _id: id },
            { $set: updatedFields }, // Utilizar el operador $set para actualizar solo los campos proporcionados
            { new: true, runValidators: true }
        ).populate('category')
        if (!updatedProduct) {
            return res.status(404).send({ message: 'The product was not found' })
        }
        return res.send({ message: 'The product was updated', data: updatedProduct })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Something went wrong' })
    }
}

export const deleteP = async (req, res) => {
    try {
        let {id} = req.params
        let deleteProduct = await Product.findOneAndDelete({_id: id})
        if (!deleteProduct) return res.status(404).send({ message: 'We dont have this product' })
        return res.send({ message: `The product ${deleteProduct.name} was deleted successfully` })
    } catch (error) {
        console.error(error)
        return res.status(404).send({ message: 'Umm something was wrong' })
    }
}

export const findProduct = async (req, res) => {
    try {
        const { search } = req.params;
        const product = await Product.find({ name: { $regex: search, $options: 'i' } }).populate('category');

        if (product.length === 0) {
            return res.status(404).send({ message: 'The product you are looking for was not found' });
        }

        return res.send({ message: 'Product found', data: product });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Something went wrong' });
    }
};

export const listCate = async (req, res) => {
    try {
        let data = await Product.find().populate('category')
        return res.send({data})
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Umm something was wrong' })
    }
}

export const outOfStock = async (req, res) => {
    try {
        let data = await Product.findOne({stock: 0}).populate('category')
        if (!data) return res.status(444).send({ message: "We didnt found products out of stock" })
        return res.send({data})
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Umm something was wrong'})
    }
}

export const bestSellers = async (req, res) => {
    try {
        const { limit = 5 } = req.query // Obtener el límite de productos a devolver desde la consulta
        const bestSellers = await Product.find()
            .sort({ salesCount: -1 }) // Ordenar por salesCount en orden descendente
            .limit(parseInt(limit)) // Limitar la cantidad de productos devueltos
            .populate('category') // Poblar la categoría de cada producto

        if (bestSellers.length === 0) {
            return res.status(404).send({ message: 'There are no sells' })
        }

        return res.send({ message: 'Best sellers', data: bestSellers })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Umm something was wrong' })
    }
}

export const productsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params

        // Verificar si la categoría existe
        const category = await Category.findOne({ _id: categoryId })
        if (!category) {
            return res.status(404).send({ message: 'The category does not exist' })
        }

        // Obtener los productos que pertenecen a la categoría
        const products = await Product.find({ category: category._id }).populate('category')

        if (products.length === 0) {
            return res.status(404).send({ message: 'There are no products in this category' })
        }

        return res.send({ message: 'Products of the category', data: products })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Umm something went wrong' })
    }
}