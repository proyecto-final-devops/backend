const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const productController = require('../controllers/productController'); 

router.post('/',  /*authenticate  , */ productController.createProduct);
router.get('/',/*authenticate , */productController.getProducts);
router.put('/:id', /*authenticate,*/ productController.updateProduct);
router.delete('/:id', /* authenticate, */productController.deleteProduct);
router.post('/comprar', /*authenticate,*/ productController.buyProduct);  

module.exports = router;