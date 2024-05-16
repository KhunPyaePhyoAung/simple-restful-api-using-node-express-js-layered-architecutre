const ValidationError = require('../error/ValidationError');
const fs = require('fs');
const stream = require('stream');

const productController = ({ productService }) => {
    return {
        searchProducts: async (req, res) => {

        },

        findAllProducts: async (req, res) => {
            try {
                const products = await productService.findAllProducts();
                return res.status(200).json({
                    meta: {
                        total: products.length
                    },
                    data: products
                });
            } catch (error) {
                console.log(error);
                return res.status(500).end();
            }
        },

        findProductById: async (req, res) => {
            const id = req.params.id;
            try {
                const product = await productService.findProductById(id);
                if (product) {
                    return res.status(200).json({
                        data: product
                    });
                }

                return res.status(404).json({
                    message: 'No Product Found with this id.'
                });
            } catch (error) {
                return res.status(500).end();
            }
        },

        createProduct: async (req, res) => {
            const newProduct = req.body;

            try {
                const createdProuct = await productService.createProduct(newProduct);
                const createdProuctUrl = `${process.env.SERVER_BASE_URL}/api/products/${createdProuct.id}`;
                res.location(createdProuctUrl);
                return res.status(201).json({
                    data: createdProuct,
                    links: {
                        product: createdProuctUrl
                    }
                });
            } catch (error) {
                if (error instanceof ValidationError) {
                    return res.status(400).json({
                        errors: [
                            {
                                field: error.fieldName,
                                message: error.message
                            }
                        ]
                    });
                }

                return res.status(500).end();
            }
        },

        updateProduct: async (req, res) => {
            const id = req.params.id;
            const product = req.body;

            try {
                const updatedProduct = await productService.updateProduct(id, product);
                if (updatedProduct) {
                    const updatedProductUrl = `${process.env.SERVER_BASE_URL}/api/products/${updatedProduct.id}`;
                    res.location(updatedProductUrl);
                    return res.status(200).json({
                        data: updatedProduct,
                        links: {
                            product: updatedProductUrl
                        }
                    });
                }

                return res.status(404).json({
                    message: 'No product found.'
                });
            } catch (error) {
                if (error instanceof ValidationError) {
                    return res.status(400).json({
                        errors: [
                            {
                                field: error.fieldName,
                                message: error.message
                            }
                        ]
                    });
                }

                return res.status(500).end();
            }
        },

        partialUpdateProduct: async (req, res) => {
            const id = req.params.id;
            const product = req.body;

            try {
                const updatedProduct = await productService.partialUpdateProduct(id, product);
                if (updatedProduct) {
                    const updatedProductUrl = `${process.env.SERVER_BASE_URL}/api/products/${updatedProduct.id}`;
                    res.location(updatedProductUrl);
                    return res.status(200).json({
                        data: updatedProduct,
                        links: {
                            product: updatedProductUrl
                        }
                    });
                }

                return res.status(404).json({
                    message: 'No product found.'
                });
                
            } catch (error) {
                if (error instanceof ValidationError) {
                    return res.status(400).json({
                        errors: [
                            {
                                field: error.fieldName,
                                message: error.message
                            }
                        ]
                    });
                }

                return res.status(500).end();
            }
        },

        deleteProductById: async (req, res) => {
            const id = req.params.id;
            try {
                const deletedProduct = await productService.deleteProductById(id);
                if (deletedProduct) {
                    return res.status(204).end();
                }
                
                return res.status(404).json({
                    message: 'No product found.'
                });
            } catch (error) {
                return res.status(500).end();
            }
        },

        getProductImage: async (req, res) => {
            try {
                const r = fs.createReadStream(await productService.getProductImagePath(req.params.name));
                const ps = new stream.PassThrough();
                stream.pipeline(
                r,
                ps,
                (err) => {
                    if (err) {
                        return res.status(404).end(); 
                    }
                });
                ps.pipe(res);
            } catch (error) {
                return res.status(500).end();
            }
            
        }
    };
};

module.exports = productController;