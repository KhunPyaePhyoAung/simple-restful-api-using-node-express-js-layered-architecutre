const { result } = require('validate.js');
const ValidationError = require('../error/ValidationError');
const {getConnection} = require('../tool/MySqlPool');

const findAllUsers = async () => {
    const connection = await getConnection();

    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM `user`';
        connection.query(sql, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
        connection.release();
    });
};

const findUserById = async (id) => {
    const connection = await getConnection();

    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM `user` WHERE `id` = ?';
        const params = [id];
        connection.query(sql, params, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0]);
            }
            connection.release();
        })
    });
};

const findUserByEmail = async (email) => {
    const connection = await getConnection();

    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM `user` WHERE `email` = ?';
        const params = [email];
        connection.query(sql, params, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0]);
            }
            connection.release();
        });
    });
};

const findUserByUsername = async (username) => {
    const connection = await getConnection();

    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM `user` WHERE `email` = ?';
        const params = [username];
        connection.query(sql, params, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result[0]);
            }
            connection.release();
        });
    });
};

const createUser = async (user) => {
    const connection = await getConnection();

    const insertedId = await new Promise((resolve, reject) => {
        const insertSql = 'INSERT INTO `user` (`name`, `email`, `password`, `gender`, `role`) VALUES (?, ?, ?, ?, ?)';
        const insertParams = [user.name, user.email, user.password, user.gender, user.role];
        connection.query(insertSql, insertParams, (error, result) => {
            if (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    const duplicateError = new ValidationError('This email already exists.', 'email');
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
    
    const createdUser = await findUserById(insertedId);

    return createdUser;
};

const updateUser = async (id, user) => {

    const connection = await getConnection();

    const affectedRows = await new Promise((resolve, reject) => {
        const updateQuery = 'UPDATE `user` SET `name` = ?, `email` = ?, `password` = ?, `gender` = ?, `role` = ? WHERE `id` = ?';
        const updateParams = [user.name, user.email, user.password, user.gender, user.role, id];
        connection.query(updateQuery, updateParams, (error, result) => {
            if (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    const duplicateError = new ValidationError('This email already exists.', 'email');
                    reject(duplicateError);
                } else {
                    reject(error);
                }
            } else {
                resolve(result.affectedRows);
            }
        });
    });

    connection.release();

    user.id = id;

    return affectedRows ? await findUserById(id) : user;
};

const partialUpdateUser = async (id, user) => {
    delete user.id;

    const connection = await getConnection();

    const affectedRows = await new Promise((resolve, reject) => {
        let updateSql = 'UPDATE `user` SET';
        let updateParams = [];
        let isFirst = true;
        Object.entries(user).forEach(entry => {
            const [key, value] = entry;
            if (!isFirst) {
                updateSql += ',';
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
                    const duplicateError = new ValidationError('This email already exists.', 'email');
                    reject(duplicateError);
                } else {
                    reject(error);
                }
            } else {
                resolve(result.affectedRows);
            }
        });
    });

    connection.release();

    user.id = id;
    return affectedRows ? await findUserById(id) : user;
};

const deleteUserById = async (id) => {

    const connection = await getConnection();

    const affectedRows = await new Promise((resolve, reject) => {
        const deleteSql = 'DELETE FROM `user` WHERE `id` = ?';
        const deleteParams = [id];
        connection.query(deleteSql, deleteParams, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result.affectedRows);
            }
        });
    });

    connection.release();

    return affectedRows === 1;
};

module.exports = {
    findAllUsers,
    findUserById,
    findUserByEmail,
    findUserByUsername,
    createUser,
    updateUser,
    partialUpdateUser,
    deleteUserById
};