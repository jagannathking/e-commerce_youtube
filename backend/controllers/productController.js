const Product = require("../models/productModel")
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const ApiFeatures = require("../utils/apiFeatures")


// Create product -- Admin

exports.createProduct = catchAsyncErrors(async (req, res, next) => {

    req.body.user = req.user.id;


    const product = await Product.create(req.body)

    res.status(201).json({
        success: true,
        product
    })

})

// Get All product
exports.getAllProducts = catchAsyncErrors(async (req, resp) => {

    const resultPerPage = 5;
    const productCount = await Product.countDocuments()

    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage)
    const products = await apiFeature.query;

    resp.status(200).json({
        success: true,
        products
    })
})

// Get Product Details

exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404))
    }

    res.status(200).json({
        success: true,
        product,
        productCount

    })

})

// Update Product -- Admin

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404))

    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: true
    })
    res.status(200).json({
        success: true,
        product

    })
})
// Delete Product

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404))

    }

    await product.deleteOne();

    res.status(200).json({
        success: true,
        message: "Product Delete Successfully"
    })

})

// Create New Review or Update the review  ...(This is not working Check it)
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    }

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(rev => 
        rev.user.toString() === req.user._id.toString());


    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString())
                (rev.rating = rating), (rev.comment = comment);
        });
    }
    else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg = 0;

    product.reviews.forEach((rev) => {
        avg +=rev.rating;
    })

    product.ratings = avg / product.reviews.length;


    await product.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true,
    })
})

//Get All Reviews of a product 
exports.getProductReviews = catchAsyncErrors(async(req,res,next) => {
    const product = await Product.findById(req.query.id);

    if(!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews,
    })
})

// Delete Review ...(This is not working check it)
exports.deleteReview = catchAsyncErrors(async(req,res,next) => {
    const product = await Product.findById(req.query.productId);

    if(!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString()
    );

    let avg = 0;
    reviews.forEach((rev) => {
        avg += rev.rating;
    })

    const ratings = avg / reviews.length;

    const numOfReviews = reviews.length;

   let data =  await Product.findByIdAndUpdate(req.query.productId,
        {
            reviews: reviews.map(review => ({
                user: review.user,
                name: review.name,
                rating: parseInt(review.rating),
                comment: review.comment,
                _id: review._id
              })),
            ratings,
            numOfReviews,
        },
        {
            new:true,
            runValidators: true,
            useFindAndModify: false,
        }
        
        );

    res.status(200).json({
        success: true,
    });
    console.log(data)
});