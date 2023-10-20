const validate = require('validate.js');

const validImageExtensions = ['.jpg', 'png', 'jpeg'];

const productCreateConstraints = {
    name: {
        presence: {
            message: '^Product name is required.'
        },
        length: {
            maximum: 60,
            tooLong: '^The maximum length of the product name is %{count}'
        },

    },
    price: {
        presence: {
            message: '^Price is required.'
        },
        numericality: {
            strict: true,
            greaterThan: 1,
            notLessThanOrEqualTo: '^Invalid price.',
            notValid: '^Invalid price.'
        }
    },
    category: {
        presence: {
            message: '^Category is required.'
        }
    },
    size: {
        presence: {
            message: '^Size is required.'
        },
        length: {
            maximum: 100,
            tooLong: '^The maximum length of the size is %{count} character(s).'
        }
    },
    instock: {
        presence: {
            message: 'Instock is required.'
        },
        numericality: {
            strict: true,
            greaterThanOrEqualTo: 0,
            notGreaterThanOrEqualTo: '^Invalid stock',
            notValid: '^Invalid stock'
        }
    }
};

const productUpdateConstraints = {
    ...productCreateConstraints
};

const productPartialUpdateConstraints = {
    name: {
        length: {
            maximum: 60,
            tooLong: '^The maximum length of the product name is %{count}'
        },

    },

    price: {
        numericality: {
            strict: true,
            greaterThan: 1,
            notLessThanOrEqualTo: '^Invalid price.',
            notValid: '^Invalid price.'
        }
    },

    size: {
        length: {
            maximum: 100,
            tooLong: '^The maximum length of the size is %{count} character(s).'
        }
    },

    instock: {
        numericality: {
            strict: true,
            greaterThanOrEqualTo: 0,
            notGreaterThanOrEqualTo: '^Invalid stock',
            notValid: '^Invalid stock'
        }
    }
};

const validateCreateProduct = async (req, res, next) => {
    const product = req.body;
    if (product.id) {
        return res.status(409).json({
            message: 'Cannot create a product with id.'
        });
    }

    const images = req.files.images;
    const imageArray = Array.isArray(images) ? [...images] : [images];
    req.body.images = imageArray;

    let validationResult = validate(product, productCreateConstraints);

    for (let i = 0; i < imageArray.length; i++) {
        if (!imageArray[i].mimetype.startsWith('image/')) {
            if (!validationResult) {
                validationResult = {};
            } 
            validationResult.images = ['Invalid image file.'];
            break;
        }
    }

    if (validationResult) {
        return res.status(400).json({
            errors: validationResult
        });
    }

    next();
};

const validateUpdateProduct = async (req, res, next) => {
    const product = req.body;
    product.id = req.params.id;

    const validationResult = validate(product, productUpdateConstraints);

    if (validationResult) {
        return res.status(400).json({
            errors: validationResult
        });
    }

    next();
};

const validatePartialUpdateProduct = async (req, res, next) => {
    const product = req.body;
    product.id = req.params.id;

    const validationResult = validate(product, productPartialUpdateConstraints);

    if (validationResult) {
        return res.status(500).json({
            errors: validationResult
        });
    }

    next();
};

module.exports = {
    productCreateConstraints,
    productUpdateConstraints,
    productPartialUpdateConstraints,
    validateCreateProduct,
    validateUpdateProduct,
    validatePartialUpdateProduct
};