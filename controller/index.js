const services = require('../service');

module.exports.userController = require('./UserController')({
    userService: services.userService
});

module.exports.productController = require('./ProductController')({
    productService: services.productService
});

module.exports.authController = require('./AuthController')({
    authService: services.authService,
    userService: services.userService,
    tokenService: services.tokenService
});