const productService = ({ productRepository, productImageRepository }) => {
    return {
        searchProducts: async (filter) => {

        },

        findAllProducts: async () => {
            try {
                const products = await productRepository.findAllProducts();
                return products;
            } catch (error) {
                throw error;
            }
        },

        findProductById: async (id) => {
            try {
                const intId = parseInt(id);
                const product = await productRepository.findProductById(intId);
                return product;
            } catch (error) {
                throw error;
            }
        },

        createProduct: async (product) => {
            try {
                product.imageUrls = await productImageRepository.saveImages(product.images);
                const createdProuct = await productRepository.createProduct(product);
                return createdProuct;
            } catch (error) {
                throw error;
            }
        },

        updateProduct: async (id, product) => {
            try {
                const intId = parseInt(id);
                const updatedProduct = await productRepository.updateProduct(intId, product);
                return updatedProduct;
            } catch (error) {
                throw error;
            }
        },

        partialUpdateProduct: async (id, product) => {
            try {
                const intId = parseInt(id);
                const updatedProduct = await productRepository.partialUpdateProduct(intId, product);
                return updatedProduct;
            } catch (error) {
                throw error;
            }
        },

        deleteProductById: async (id) => {
            try {
                const intId = parseInt(id);
                const deletedProduct = await productRepository.deleteProductById(intId);
                return deletedProduct;
            } catch (error) {
                throw error;
            }
        },

        getProductImagePath: async (name) => {
            const imagePath = await productImageRepository.getPath(name);
            return imagePath;
        },

        getProductImage: async (name) => {
            const image = await productImageRepository.getImage(name);
            return image;
        },

        getAllCategories: async () => {
            const categories = await productRepository.getAllCategories();
            return categories;
        }
    };
};

module.exports = productService;