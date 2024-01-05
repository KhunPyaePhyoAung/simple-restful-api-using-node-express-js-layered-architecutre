const userService = ({ userRepository, passwordEncryptService }) => {
    return {
        findAllUsers: async () => {
            try {
                const users = await userRepository.findAllUsers();
                return users;
            } catch (error) {
                throw error;
            }
        },

        findUserById: async (id) => {
            try {
                const intId = parseInt(id);
                const user = await userRepository.findUserById(intId);
                return user;
            } catch (error) {
                throw error;
            }
            
        },

        findUserByUsername: async (username) => {
            try {
                const user = await userRepository.findUserByUsername(username);
                return user;
            } catch (error) {
                throw error;
            }
        },

        createUser: async (user) => {
            try {
                user.password = passwordEncryptService.encrypt(user.password);
                const createdUser = await userRepository.createUser(user);
                return createdUser;
            } catch (error) {
                throw error;
            }
            
        },

        updateUser: async (id, user) => {
            try {
                const intId = parseInt(id);
                user.password = passwordEncryptService.encrypt(user.password);
                const updatedUser = await userRepository.updateUser(intId, user);
                return updatedUser;
            } catch (error) {
                throw error;
            }
        },

        partialUpdateUser: async (id, user) => {
            try {
                const intId = parseInt(id);
                if (user.password) {
                    user.password = passwordEncryptService.encrypt(user.password);
                }
                const updatedUser = await userRepository.partialUpdateUser(intId, user);
                return updatedUser;
            } catch (error) {
                throw error;
            }
        },

        deleteUserById: async (id) => {
            try {
                const intId = parseInt(id);
                const deleted = await userRepository.deleteUserById(intId);
                return deleted;
            } catch (error) {
                throw error;
            }
        },
    };
};

module.exports = userService;