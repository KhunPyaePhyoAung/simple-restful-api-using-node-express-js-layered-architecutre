const express = require('express');
const router = express.Router();
const ROLES = require('../model/UserRoles');
const { verifyUserToken, verifyUserRole } = require('../middleware/Auth');
const {
    validateCreateProduct,
    validateUpdateProduct,
    validatePartialUpdateProduct
} = require('../middleware/ProductValidation');
const { productController } = require('../controller');

router.get(
    '/search',
    productController.searchProducts
);

router.get(
    '/',
    productController.findAllProducts
);

router.get(
    '/:id',
    productController.findProductById
);

router.get(
    '/images/:name',
    productController.getProductImage
);

router.post(
    '/',
    [verifyUserToken, verifyUserRole(ROLES.ADMIN), validateCreateProduct],
    productController.createProduct
);

router.put(
    '/:id',
    [verifyUserToken, verifyUserRole(ROLES.ADMIN), validateUpdateProduct],
    productController.updateProduct
);

router.patch(
    '/:id',
    [verifyUserToken, verifyUserRole(ROLES.ADMIN), validatePartialUpdateProduct],
    productController.partialUpdateProduct
);

router.delete(
    '/:id',
    [verifyUserToken, verifyUserRole(ROLES.ADMIN)],
    productController.deleteProductById
);

module.exports = router;