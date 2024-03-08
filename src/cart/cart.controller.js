import Cart from './cart.model.js'
import Product from '../product/product.model.js'
import Check from '../check/check.model.js'


export const add = async (req, res) => {
    try {
        let { product, numberProduct, buyComplete } = req.body
        let uid = req.user._id
 
        let productData = await Product.findById(product)
        if (!productData || productData.stock === 0 || numberProduct > productData.stock) {
            return res.status(400).send({ message: 'There is insufficient stock for this product.'})
        }
        if (!buyComplete) {
            let cart = await Cart.findOne({ user: uid })
            if (!cart) {
                let newCart = new Cart({
                    user: uid,
                    products: [{ product: product, numberProduct }],
                    total: 0
                })
                let total = 0
                for (let item of newCart.products) {
                    let productData = await Product.findById(item.product)
                    if (productData) {
                        total += productData.price * item.numberProduct
                    }
                }
                newCart.total = total
                console.log(newCart.total)
                await newCart.save()
                return res.send({ message: 'Product added to cart successfully.', total })
            }
            let productIndex = cart.products.findIndex(p => p.product.equals(product))
 
            if (productIndex !== -1) {
                cart.products[productIndex].numberProduct += parseInt(numberProduct)
            } else {
                cart.products.push({ product: product, numberProduct })
            }
            let total = 0
            for (let item of cart.products) {
                let productData = await Product.findById(item.product)
                if (productData) {
                    total += productData.price * item.numberProduct
                }
            }
            cart.total = total
            await cart.save()
 
            return res.send({ message: 'Product added to cart successfully.', total })
        } else {
            if (buyComplete !== 'CONFIRM') return res.status(400).send({ message: `Validation word must be 'CONFIRM'.` })
 
            let cart = await Cart.findOne({ user: uid })
 
            if (!cart) {
                return res.status(400).send({ message: 'The cart is empty.' })
            }
 
            let checkItems = []
            for (let item of cart.products) {
                let productData = await Product.findById(item.product)
                if (productData) {
                    checkItems.push({
                        product: item.product,
                        numberProduct: item.numberProduct,
                        unitPrice: productData.price,
                        totalPrice: productData.price * item.numberProduct
                    })
                }
            }
            let check = new Check({
                user: cart.user,
                items: checkItems,
                total: cart.total
            })
            console.log(`cart.total = ${cart.total}`)
            let savedCheck = await check.save()
           
            for (let item of cart.products) {
                let productData = await Product.findById(item.product)
                if (productData) {
                    productData.stock -= item.numberProduct
                    await productData.save()
                }
            }
            await Cart.deleteOne({ _id: cart._id })
            return res.send({ message: 'Purchase completed successfully and check generated.', check: savedCheck })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error processing purchase.', error: error });
    }
}
// No pude hacer el pdf :(