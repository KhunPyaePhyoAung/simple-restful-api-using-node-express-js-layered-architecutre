const validate = require('validate.js');
const roles = require('../model/UserRoles');

const userCreateConstraints = {
    name: {
        presence: {
            message: '^Name is required.'
        },

        length: {
            maximum: 60,
            tooLong: '^The maximum length of name is %{count} character(s).'
        }
    },

    email: {
        presence: {
            message: '^Email is required.'
        },

        email: {
            message: '^Invalid email.'
        },

        length: {
            maximum: 225,
            tooLong: '^The maximum length of the email is %{count} character(s).'
        }
    },

    password: {
        presence: {
            message: '^Password is required.'
        },

        format: {
            pattern: /^\S*$/,
            message: '^Password cannot contain space.'
        },

        length: {
            minimum: 8,
            maximum: 30,
            tooShort: '^The minumum length of password is %{count} character(s).',
            tooLong: '^The maximum length of password is %{count} character(s).'
        }
    },

    role: {
        presence: {
            message: '^Role is required.'
        },
        
        inclusion: {
            within: roles,
            message: '^%{value} is not a valid role.'
        }
    }
};

const userUpdateConstraints = {...userCreateConstraints};

const userPartialUpdateConstraints = {
    name: {
        length: {
            maximum: 60,
            tooLong: '^The maximum length of name is %{count} character(s).'
        }
    },

    email: {
        email: {
            message: '^Invalid email.'
        }
    },

    password: {
        length: {
            minimum: 8,
            maximum: 30,
            tooShort: '^The minumum length of password is %{count} character(s).',
            tooLong: '^The maximum length of password is %{count} character(s).'
        }
    },

    role: {
        inclusion: {
            within: roles,
            message: '^%{value} is not a valid role.'
        }
    }
};

const validateCreateUser = async (req, res, next) => {
    const user = req.body;

    if (user.id) {
        return res.status(409).json({
            message: validationResult.id[0]
        });
    }

    const validationResult = validate(user, userCreateConstraints);
    if (validationResult) {
        return res.status(400).json({
            errors: validationResult
        });
    }

    next();
};

const validateUpdateUser = async (req, res, next) => {
    const user = req.body;
    user.id = req.params.id;

    const validationResult = validate(user, userUpdateConstraints);
    if (validationResult) {
        return res.status(400).json({
            errors: validationResult
        });
    }

    next();
};

const validatePartialUpdateUser = async (req, res, next) => {
    const user = req.body;
    user.id = req.params.id;

    const validationResult = validate(user, userPartialUpdateConstraints);
    if (validationResult) {
        return res.status(400).json({
            errors: validationResult
        });
    }

    next();
};

module.exports = {
    userCreateConstraints,
    userUpdateConstraints,
    userPartialUpdateConstraints,
    validateCreateUser,
    validateUpdateUser,
    validatePartialUpdateUser,
};