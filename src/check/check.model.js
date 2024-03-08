    import {Schema, model} from 'mongoose'

    const checkSchema = new Schema({

        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        products:[{
                product:{
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                numberProduct: {
                    type: Number,
                    required: true
                },
                priceBynit: {
                    type: Number,
                    required: true
                }
            }
        ],
        total: {
            type: Number,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    },{
        versionKey: false
    })

    export default model('check', checkSchema )