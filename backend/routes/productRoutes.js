const express = require('express')
const { getProducts, getProductsByID, addProduct, updateProduct, deleteProduct } = require('../controllers/productController')


//router object 
const router = express.Router()

//routes
//GET ALL PRODUCTS BY ID
router.get('/get/:id', getProductsByID );
//GET ALL PRODUCTS LIST || GET
router.get('/getall', getProducts );
//add product 
router.post('/create', addProduct );
//update product
router.put('/update/:id', updateProduct ); 
//delete product 
router.delete('/delete/:id',deleteProduct);



module.exports = router; 