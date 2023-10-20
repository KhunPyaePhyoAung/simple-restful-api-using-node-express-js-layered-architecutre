const searchProducts = async (filter) => {

};

const findAllProducts = async () => {
    return [
        {
            id: 1,
            name: 'Product 1',
            category: {
                id: 1,
                name: 'Men'
            },
            price: 15000,
            size: [
                36, 37, 38
            ],
            instock: 4,
            created_at: '2023-09-01'
        },
        {
            id: 2,
            name: 'Product 2',
            category: {
                id: 2,
                name: 'Women'
            },
            price: 20000,
            size: [
                36, 37, 38
            ],
            instock: 6,
            created_at: '2023-09-01'
        },
        {
            id: 3,
            name: 'Product 3',
            category: {
                id: 3,
                name: 'Kid'
            },
            price: 10000,
            size: [
                12, 14
            ],
            instock: 2,
            created_at: '2023-09-01'
        },
    ]
};

const findProductById = async (id) => {
    return {
        id: 1,
        name: 'Product 1',
        category: {
            id: 1,
            name: 'Men'
        },
        price: 15000,
        size: [
            36, 37, 38
        ],
        instock: 4,
        created_at: '2023-09-01'
    };
};

const createProduct = async (product) => {
    return {
        id: 1,
        name: 'Product 1',
        category: {
            id: 1,
            name: 'Men'
        },
        price: 15000,
        size: [
            36, 37, 38
        ],
        instock: 4,
        created_at: '2023-09-01'
    };
};

const updateProduct = async (id, product) => {
    return {
        id: 1,
        name: 'Product 1',
        category: {
            id: 1,
            name: 'Men'
        },
        price: 15000,
        size: [
            36, 37, 38
        ],
        instock: 4,
        created_at: '2023-09-01'
    };
};

const partialUpdateProduct = async (id, product) => {
    return {
        id: 2,
        name: 'Product 1',
        category: {
            id: 1,
            name: 'Men'
        },
        price: 15000,
        size: [
            36, 37, 38
        ],
        instock: 4,
        created_at: '2023-09-01'
    };
};

const deleteProductById = async (id) => {
    return {
        id: 1,
        name: 'Product 1',
        category: {
            id: 1,
            name: 'Men'
        },
        price: 15000,
        size: [
            36, 37, 38
        ],
        instock: 4,
        created_at: '2023-09-01'
    };
};

const getAllCategories = async () => {
    return ['MEN', 'WOMEN', 'UNISEX', 'KIDS'];
};

module.exports = {
    searchProducts,
    findAllProducts,
    findProductById,
    createProduct,
    updateProduct,
    partialUpdateProduct,
    deleteProductById
};