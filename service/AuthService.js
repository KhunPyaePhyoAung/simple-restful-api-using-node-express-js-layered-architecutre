const authService = ({ userRepository, passwordEncryptService} ) => {
    return {
        loginWithUsernameAndPassword: async (username, password) => {
            try {
                const user = await userRepository.findUserByUsername(username);
                if (user && passwordEncryptService.match(password, user.password) ) {
                    return user;
                }
                return null;
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