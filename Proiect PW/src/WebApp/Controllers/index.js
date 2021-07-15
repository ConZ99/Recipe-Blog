const Router = require('express')();
//1 - admin; 2 - moderator; 3 - user
const {
    authorizeAndExtractTokenAsync 
    } = require('../Filters/JWTFilter.js')

const UsersController = require('./UsersController.js');
const PostsController = require('./PostsController.js');

Router.use('/v1/users', UsersController);
Router.use('/v1/posts', authorizeAndExtractTokenAsync, PostsController);

module.exports = Router;