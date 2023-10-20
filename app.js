const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const app = express();
const {
    userRouter,
    productRouter,
    authRouter
} = require('./router');
const auth = require('./middleware/Auth');

app.use(fileUpload());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(cors());

app.use('/api', authRouter);
app.use('/api/users', [auth.verifyUserToken], userRouter);
app.use('/api/products', productRouter);

module.exports = app;