const { response } = require('express');
const ValidationError = require('../error/ValidationError');

require('dotenv').config();

const userController = ({ userService }) => {
    return {
        findAllUsers: async (req, res) => {
            try {
                const users = await userService.findAllUsers();
                return res.status(200).json({
                    meta: {
                        total: users.length
                    },
                    data: users
                });
            } catch (error) {
                return res.status(500).end();
            }
        },


        findUserById: async (req, res) => {
            const id = req.params.id;
            try {
                const user = await userService.findUserById(id);
                if (user) {
                    return res.status(200).json({
                        data: user
                    });
                }

                return res.status(404).json({
                    message: 'No user with this id'
                });
                
            } catch (error) {
                return res.status(500).end();
            }
        },


        createUser: async (req, res) => {
            const newUser = req.body;

            try {
                const createdUser = await userService.createUser(newUser);
                delete createdUser.password;
                const createdUserUrl = `${process.env.SERVER_BASE_URL}/api/users/${createdUser.id}`;
                res.location(createdUserUrl);
                return res.status(201).json({
                    data: createdUser,
                    links: {
                        user: createdUserUrl
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


        updateUser: async (req, res) => {
            const id = req.params.id;
            const user = req.body;

            try {
                const updatedUser = await userService.updateUser(id, user);
                if (updatedUser) {
                    const updatedUserUrl = `${process.env.SERVER_BASE_URL}/api/users/${updatedUser.id}`;
                    res.location(updatedUserUrl);
                    return res.status(200).json({
                        data: updatedUser,
                        links: {
                            user: updatedUserUrl
                        }
                    });
                }

                return res.status(404).json({
                    message: 'No user found.'
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


        partialUpdateUser: async (req, res) => {
            const id = req.params.id;
            const user = req.body;

            try {
                const updatedUser = await userService.partialUpdateUser(id, user);
                delete updatedUser.password;
                if (updatedUser) {
                    const updatedUserUrl = `${process.env.SERVER_BASE_URL}/api/users/${updatedUser.id}`;
                    res.location(updatedUserUrl);
                    return res.status(200).json({
                        data: updatedUser,
                        links: {
                            user: updatedUserUrl
                        }
                    });
                }

                return res.status(404).json({
                    message: 'No user found.'
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


        deleteUserById: async (req, res) => {
            const id = req.params.id;
            try {
                const deleted = await userService.deleteUserById(id);
                if (deleted) {
                    return res.status(204).end();
                }
                
                return res.status(404).json({
                    message: 'No User found.'
                });
            } catch (error) {
                return res.status(500).end();
            }
        },


    }
};

module.exports = userController;