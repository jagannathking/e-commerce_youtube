const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Name"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"Please Enter description"]
    },
    price:{
        type:String,
        required:[true,"Please Enter price"],
        maxLength:[8,"price can not exceed 8 characters"]

    },
    ratings:{
        type:Number,
        default:0  
    },
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    ],
    category:{
        type:String,
        required:[true,"Please Enter category"]

    },
    Stock:{
        type:Number,
        required:[true,"Please Enter Stock"],
        maxLength:[4,"Stock cannot exceed 4 characters"],
        default:1
        
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {   
            user:{
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true,
             },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:String,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],

    user:{
       type: mongoose.Schema.ObjectId,
       ref: "User",
       required: true,
    },
    
    createdAt:{
        type:Date,
        default:Date.now
    }
   
})

module.exports = mongoose.model("Product",productSchema)