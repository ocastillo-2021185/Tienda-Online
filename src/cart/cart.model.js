import {Schema, model} from 'mongoose'

const cartSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        require: [true, "User is require"]
    },
    products:[{
        product:{
            type: Schema.Types.ObjectId,
            ref: 'product',
            require: [true, "Product is require"]
        },
        numberProduct:{
            type: Number,
            default: 1,
            require: [true, "number of products is require"]
        }
    }],
    total:{
        type: Number,
        default: 0
    }
    
},{
    versionKey: false
})

export default model('cart', cartSchema)