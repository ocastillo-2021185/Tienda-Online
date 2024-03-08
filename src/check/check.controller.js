import CheckModel from './check.model.js'
import ProductModel from '../product/product.model.js'

export const updateCheckItem = async (req,res)=>{
    try {
        const {id} = req.params
        const {productId,quantity} = req.body
        if (!productId && !quantity) {
            return res.status(400).send({message:'Product ID and quantity are required'});
        }
        const check = await CheckModel.findById(id);
        if (!check) {
            return res.status(404).send({message:'Check not found'});
        }
        const itemToUpdate = checkDocument.items.find(item => item._id.toString() === productId)
        if (!itemToUpdate) {
            return res.status(404).send({message: 'Item not found in the check'})
        }
        if (productId) {
            itemToUpdate.product = productId
            const productInfo = await ProductModel.findById(productId)
            if (!productInfo) {
                return res.status(404).send({message: 'Product not found'})
            }
            const oldUnitPrice = itemToUpdate.unitPrice
            itemToUpdate.unitPrice = productInfo.price
            checkDocument.totalAmount += (itemToUpdate.unitPrice - oldUnitPrice) * itemToUpdate.quantity
            if (quantity !== undefined) {
                const oldQuantity = itemToUpdate.quantity
                const quantityDifference = quantity - oldQuantity
                productInfo.stock -= quantityDifference
                await productInfo.save()
            }
        }
        if (quantity !== undefined) {
            const oldQuantity = itemToUpdate.quantity
            const quantityDifference = quantity - oldQuantity
            itemToUpdate.quantity = quantity
            checkDocument.totalAmount += quantityDifference * itemToUpdate.unitPrice
            const productInfo = await ProductModel.findById(itemToUpdate.product)
            if (!productInfo) {
                return res.status(404).send({ message: 'Product not found' })
            }
            productInfo.stock -= quantityDifference;
            await productInfo.save()
        }
        await checkDocument.save()

        return res.send({ message: 'Item updated successfully', check: checkDocument })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error updating item' })
    }
}