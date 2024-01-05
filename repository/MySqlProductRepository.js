const ValidationError = require('../error/ValidationError');
const {getConnection} = require('../tool/MySqlPool');

const selectQuery = 'SELECT `p`.*, `u`.`id` AS `user_id`, `u`.`name` AS `user_name`, `u`.`email` AS `user_email`, `u`.`password` AS `user_password`, `u`.`gender` AS `user_gender`, `u`.`role` AS `user_role` FROM `product` `p` INNER JOIN `user` `u` ON `p`.`created_by` = `u`.`id`';

const mapProduct = (row) => {
    const product = {
        id: row.id,
        name: row.name,
        price: row.price,
        category: row.category,
        size: row.size,
        instock: row.instock,
        created_by: {
            id: row.user_id,
            name: row.user_name,
            email: row.user_email,
            password: row.user_password,
            gender: row.user_gender,
            role: row.user_role
        }
    };
    return product;
}

const searchProducts = async (filter) => {

};

const findAllProducts = async () => {
    const connection = await getConnection();

    const productRows = await new Promise((resolve, reject) => {
        const selectSql = selectQuery;
        connection.query(selectSql, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });

    connection.release();

    const products = [];
    productRows.forEach(p => {
        products.push(mapProduct(p));
    });

    return products;
};

const findProductById = async (id) => {
    const connection = await getConnection();

    const product = await new Promise((resolve, reject) => {
        const selectSql = selectQuery + 'WHERE `p`.`id` = ?';
        const selectParams = [id];
        connection.query(selectSql, selectParams, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result[0]);
            }
        });
    });

    connection.release();

    return mapProduct(product);
};

const createProduct = async (product, createdBy) => {
    const connection = await getConnection();

    const inseredId = await new Promise((resolve, reject) => {
        const insertSql = 'INSERT INTO `product` (`name`, `price`, `category`, `size`, `instock`, `created_by`) VALUES (?, ?, ?, ?, ?, ?)';
        const insertParams = [product.name, product.price, product.category, product.size, product.instock, createdBy.id];
        connection.query(insertSql, insertParams, (error, result) => {
            if (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    const duplicateError = new ValidationError('This name already exists.', 'name');
                    reject(duplicateError);
                }  else {
                    reject(error);
                }
            } else {
                resolve(result.insertId);
            }
        });
    });

    connection.release();

    const createdProduct = await findProductById(inseredId);
    return createdProduct;
};

const updateProduct = async (id, product) => {
    const connection = await getConnection();

    const affectedRows = await new Promise((resolve, reject) => {
        const updateSql = 'UPDATE `product` SET `name` = ?, `price` = ?, `category` = ?, `size` = ?, `instock` = ? WHER `id` = ?';
        const updateParams = [product.name, product.price, product.category, product.size, product.instock, id];
        connection.query(updateSql, updateParams, (error, result) => {
            if (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    const duplicateError = new ValidationError('This name already exists.', 'name');
                    reject(duplicateError);
                }  else {
                    reject(error);
                }
            } else {
                resolve(result.affectedRows);
            }
        });
    });

    connection.release();

    product.id = id;

    return affectedRows ? await findProductById(id) : product;
    
    
};

const partialUpdateProduct = async (id, product) => {
    delete product.id;
    delete product.created_by;
    const connection = await getConnection();

    const affectedRows = await new Promise((resolve, reject) => {
        let updateSql = 'UPDATE `product` SET';
        const updateParams = [];
        let isFirst = true;
        Object.entries(product).forEach(entry => {
            const [key, value] = entry;
            if (!isFirst) {
                updateSql += ",";
                isFirst = false;
            }
            updateSql += ` ${key} = ?`;
            updateParams.push(value);
        });
        updateSql += ' WHERE `id` = ?';
        updateParams.push(id);
        connection.query(updateSql, updateParams, (error, result) => {
            if (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    const duplicateError = new ValidationError('This name already exists.', 'name');
                    reject(duplicateError);
                }  else {
                    reject(error);
                }
            } else {
                resolve(result.affectedRows);
            }
        });
    });

    connection.release();
    product.id = id;

    return affectedRows ? await findProductById(id) : product;
};

const deleteProductById = async (id) => {
    const connection = await getConnection();

    const affectedRows = await new Promise((resolve, reject) => {
        const deleteSql = 'DELETE FROM `product` WHERE `id` = ?';
        const deleteParams = [id];
        connection.query(deleteSql, deleteParams, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result.affectedRows);
            }
        });
    });

    return affectedRows === 1;
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