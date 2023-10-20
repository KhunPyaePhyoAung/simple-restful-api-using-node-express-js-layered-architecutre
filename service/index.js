const repositories = require('../repository');
const userPasswordEncryptService = require('../service/Md5UserPasswordEncryptService');

module.exports.userPasswordEncryptService = userPasswordEncryptService;
module.exports.userService = require('./UserService')({
    userRepository: repositories.userRepository,
    passwordEncryptService: userPasswordEncryptService
});

module.exports.productService = require('./ProductService')({
    productRepository: repositories.productRepository,
    productImageRepository: repositories.productImageRepository
});

module.exports.authService = require('./AuthService')({
    userRepository: repositories.userRepository,
    passwordEncryptService: userPasswordEncryptService
});

module.exports.tokenService = require('./JwtTokenService');