const pool = require('../tool/MySqlPool');

const findAllUsers = async () => {
    const res = pool.query('SELECT * FROM `user`', function (error, results, fields) {
        if (error) throw error;
        console.log('The result is: ', results);
        results.hehe = "Hehe";
        return results;
    });
    console.log(res);
    return [
        {
            id: 1,
            name: 'User 1',
            email: 'user1@gmail.com',
            password: 'user1',
            role: 'ADMIN',
            gender: 'MALE',
            created_at: '2023-09-10'
        },
        {
            id: 2,
            name: 'User 2',
            email: 'user2@gmail.com',
            password: 'user2',
            role: 'CUSTOMER',
            gender: 'MALE',
            created_at: '2023-09-11'
        },
        {
            id: 3,
            name: 'User 3',
            email: 'user3@gmail.com',
            password: 'user3',
            role: 'CUSTOMER',
            gender: 'MALE',
            created_at: '2023-09-13'
        },
    ]
};

const findUserById = async (id) => {
    return {
        id: 3,
        name: 'User 3',
        email: 'user3@gmail.com',
        password: 'user3',
        role: 'CUSTOMER',
        gender: 'MALE',
        created_at: '2023-09-13'
    };
};

const findUserByEmail = async (email) => {
    return {
        id: 3,
        name: 'User 3',
        email: 'user3@gmail.com',
        password: 'user3',
        role: 'CUSTOMER',
        gender: 'MALE',
        created_at: '2023-09-13'
    };
};

const findUserByUsername = async (username) => {
    return {
        id: 3,
        name: 'User 1',
        email: 'user1@gmail.com',
        password: '92877af70a45fd6a2ed7fe81e1236b78',
        role: 'ADMIN',
        gender: 'MALE',
        created_at: '2023-09-13'
    };
};

const createUser = async (user) => {
    user.id = 100;
    return user;
};

const updateUser = async (id, user) => {
    return user;
};

const partialUpdateUser = async (id, user) => {
    return user;
};

const deleteUserById = async (id) => {
    return {
        id: 1,
        name: 'User 1',
        email: 'user1@gmail.com',
        password: 'user1',
        role: 'ADMIN',
        gender: 'MALE',
        created_at: '2023-09-10'
    };
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