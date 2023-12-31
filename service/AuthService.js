const authService = ({ userRepository, passwordEncryptService} ) => {
    return {
        loginWithUsernameAndPassword: async (username, password) => {
            try {
                const user = await userRepository.findUserByUsername(username);
                const error = new Error();

                if (!user) {
                    error.field = 'username';
                    error.message = 'Username does not exist';
                    throw error;
                }

                if (!passwordEncryptService.match(password, user.password)) {
                    error.field = 'password';
                    error.message = 'Incorrect password';
                    throw error;
                }
                
                return user;
            } catch (error) {
                throw error;
            }
        },

        logout: async (username) => {
            return true;
        }
    };
};

module.exports = authService;