const express = require('express');
const router = express.Router();
const ROLES = require('../model/UserRoles');
const { verifyUserRole } = require('../middleware/Auth');
const {
    validateCreateUser,
    validateUpdateUser,
    validatePartialUpdateUser
} = require('../middleware/UserValidation');

const {
    userController
} = require('../controller');

router.get(
    '/',
    [verifyUserRole(ROLES.ADMIN, ROLES.Cashier)],
    userController.findAllUsers
);

router.get(
    '/:id',
    [verifyUserRole(ROLES.ADMIN, ROLES.Cashier)],
    userController.findUserById
);

router.post(
    '/',
    [verifyUserRole(ROLES.ADMIN), validateCreateUser],
    userController.createUser
);

router.put(
    '/:id',
    [verifyUserRole(ROLES.ADMIN), validateUpdateUser],
    userController.updateUser
);

router.patch(
    '/:id',
    [verifyUserRole(ROLES.ADMIN), validatePartialUpdateUser],
    userController.partialUpdateUser
);

router.delete(
    '/:id',
    [verifyUserRole(ROLES.ADMIN)],
    userController.deleteUserById
);

module.exports = router;