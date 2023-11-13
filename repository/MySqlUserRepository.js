const ValidationError = require('../error/ValidationError');
const pool = require('../tool/MySqlPool');

const findAllUsers = async () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM `user`';
        pool.query(sql, (error, results, fields) => {
            if (error) {
                reject(error);
            }
            resolve(results);
        });
    });
};

const findUserById = async (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM `user` WHERE `id` = ?';
        const params = [id];
        pool.query(sql, params, (error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results[0]);
        })
    });
};

const findUserByEmail = async (email) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM `user` WHERE `email` = ?';
        const params = [email];
        pool.query(sql, params, (error, results) => {
            if (error) {
                reject(error);
            }

            resolve(results[0]);
        });
    });
};

const findUserByUsername = async (username) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM `user` WHERE `email` = ?';
        const params = [username];
        pool.query(sql, params, (error, results) => {
            if (error) {
                reject(error);
            }

            resolve(results[0]);
        });
    });
};

const createUser = async (user) => {
    return new Promise((resolve, reject) => {
        
        pool.getConnection((error, connection) => {
            if (error) {
                return reject(error);
            }

            connection.beginTransaction(transactionError => {
                if (transactionError) {
                    return reject(transactionError);
                }

                const insertQuery = 'INSERT INTO `user` (`name`, `email`, `password`, `gender`, `role`) VALUES (?, ?, ?, ?, ?)';
                const insertParams = [user.name, user.email, user.password, user.gender, user.role];

                connection.query(insertQuery, insertParams, (insertError, insertResults) => {
                    if (insertError) {
                        if (insertError.code === 'ER_DUP_ENTRY') {
                            const duplicateError = new ValidationError('This email already exists.', 'email');
                            return connection.rollback(() => {
                                return reject(duplicateError);
                            });
                        } else {
                            return connection.rollback(() => {
                                return reject(insertError);
                            });
                        }
                        
                    }
                    connection.commit(commitError => {
                        if (commitError) {
                            return connection.rollback(() => {
                                return reject(commitError);
                            });
                        }
                        
                    });

                    const selectQuery = 'SELECT * FROM `user` WHERE `id` = ?';
                    const selectParams = [insertResults.insertId];
                    connection.query(selectQuery, selectParams, (selectError, selectResults) => {
                        if (selectError) {
                            return reject(selectError);
                        }
                        connection.release();
                        return resolve(selectResults[0]);
                    });

                });
            });
            
        });
    });
};

const updateUser = async (id, user) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject(connectionError);
            }

            connection.beginTransaction(transactionError => {
                if (transactionError) {
                    reject(transactionError);
                }

                const updateQuery = 'UPDATE `user` SET `name` = ?, `email` = ?, `password` = ?, `gender` = ?, `role` = ? WHERE `id` = ?';
                const updateParams = [user.name, user.email, user.password, user.gender, user.role, user.id];
                connection.query(updateQuery, updateParams, (updateError, updateResults) => {
                    if (updateError) {
                        if (updateError.code === 'ER_DUP_ENTRY') {
                            const duplicateError = new ValidationError('This email already exists.', 'email');
                            return connection.rollback(() => {
                                return reject(duplicateError);
                            });
                        } else {
                            return connection.rollback(() => {
                                return reject(updateError);
                            });
                        }
                    }
                    if (updateResults.affectedRows === 1) {
                        connection.commit(commitError => {
                            if (commitError) {
                                return connection.rollback(() => {
                                    return reject(commitError);
                                });
                            }
                        })
                        const selectQuery = 'SELECT * FROM `user` WHERE `id` = ?';
                        const selectParams = [id];
                        connection.query(selectQuery, selectParams, (selectError, selectResults) => {
                            if (selectError) {
                                return reject(selectError);
                            }

                            return resolve(selectResults[0]);
                        })
                    } else {
                        return reject(new Error('User not found.'));
                    }
                });

            })
        });
    });
};

const partialUpdateUser = async (id, user) => {
    delete user.id;
    return new Promise((resolve, reject) => {
        pool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject(connectionError);
            }

            connection.beginTransaction(transactionError => {
                if (transactionError) {
                    reject(transactionError);
                }

                let updateQuery = 'UPDATE `user` SET ';
                let updateParams = [];
                let comma = '';
                Object.keys(user).forEach(key => {
                    updateQuery += comma + ' `' + key + '` = ?';
                    updateParams.push(user[key]);
                    comma = ',';
                });

                updateQuery += ' WHERE `id` = ?';
                updateParams.push(id);

                connection.query(updateQuery, updateParams, (updateError, updateResults) => {
                    if (updateError) {
                        if (updateError.code === 'ER_DUP_ENTRY') {
                            const duplicateError = new ValidationError('This email already exists.', 'email');
                            return connection.rollback(() => {
                                return reject(duplicateError);
                            });
                        } else {
                            return connection.rollback(() => {
                                return reject(updateError);
                            });
                        }
                    }
                    if (updateResults.affectedRows === 1) {
                        connection.commit(commitError => {
                            if (commitError) {
                                return connection.rollback(() => {
                                    return reject(commitError);
                                });
                            }
                        })
                        const selectQuery = 'SELECT * FROM `user` WHERE `id` = ?';
                        const selectParams = [id];
                        connection.query(selectQuery, selectParams, (selectError, selectResults) => {
                            if (selectError) {
                                return reject(selectError);
                            }

                            return resolve(selectResults[0]);
                        })
                    } else {
                        return reject(new Error('User not found.'));
                    }
                });

            })
        });
    });
};

const deleteUserById = async (id) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((connectionError, connection) => {
            if (connectionError) {
                return reject(connectionError);
            }

            connection.beginTransaction(transactionError => {
                if (transactionError) {
                    return reject(transactionError);
                }

                const deleteQuery = 'DELETE FROM `user` WHERE `id` = ?';
                const deleteParams = [id];

                connection.query(deleteQuery, deleteParams, (deleteError, deleteResults) => {
                    if (deleteError) {
                        return connection.rollback(() => {
                            reject(deleteError);
                        });
                    }

                    connection.commit(commitError => {
                        if (commitError) {
                            return connection.rollback(() => {
                                reject(commitError);
                            });
                        }
                    })

                    return resolve(deleteResults.affectedRows === 1);
                });
            });
        });
    });
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