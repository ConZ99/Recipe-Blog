const express = require('express');

const UsersManager = require('../../WebCore/Managers/UsersManager.js');
const UsersRepository = require('../../Infrastructure/PostgreSQL/Repository/UsersRepository.js');
const {
    authorizeAndExtractTokenAsync
} = require('../Filters/JWTFilter.js')
const {
    Graf1Body,
    Graf2Body,
    Graf3Body,
    UserBody,
    UserRegisterRepsonse,
    UserLoginResponse
} = require ('../Models/Users.js');
const {
    generateTokenAsync,
    verifyAndDecodeDataAsync
} = require('../../WebCore/Security/Jwt/index.js')
const ResponseFilter = require('../Filters/ResponseFilter.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');

const Router = express.Router();

Router.post('/register', async (req, res) => {
    console.log(req.body)
    const userBody = new UserBody(req.body);
    const user = await UsersManager.registerAsync(userBody.username, userBody.email, userBody.password, userBody.role_id);

    ResponseFilter.setResponseDetails(res, 201, new UserRegisterRepsonse(user));
});

Router.post('/login', async (req, res) => {

    const userBody = new UserBody(req.body);
    const userDto = await UsersManager.authenticateAsync(userBody.username, userBody.password);
    const user = new UserLoginResponse(userDto.Token, userDto.Role, userDto.username);

    ResponseFilter.setResponseDetails(res, 200, user);
});


Router.get('/home', authorizeAndExtractTokenAsync, async (req, res) => {

    const users = await UsersRepository.getAsync(req.user.userId);
    console.log("id == " + req.user.userId)

    ResponseFilter.setResponseDetails(res, 200, new UserBody(users));
});

Router.get('/getUser/:username', authorizeAndExtractTokenAsync, async (req, res) => {

    const users = await UsersRepository.getByUsername(req.params.username);
    console.log("username == " + req.params.username)

    ResponseFilter.setResponseDetails(res, 200, new UserBody(users));
});

Router.get('/allUsers', authorizeAndExtractTokenAsync,  AuthorizationFilter.authorizeRoles(1), async (req, res) => {

    const users = await UsersRepository.getAllAsync();
    console.log("id == " + req.user.userId)

    ResponseFilter.setResponseDetails(res, 200, users.map(user => new UserBody(user)));
});

Router.get('/graf1', authorizeAndExtractTokenAsync,  AuthorizationFilter.authorizeRoles(1), async (req, res) => {

    const output = await UsersRepository.viewsByRole();
    console.log(output)

    ResponseFilter.setResponseDetails(res, 200, output.map(out => new Graf1Body(out)));
});

Router.get('/graf2', authorizeAndExtractTokenAsync,  AuthorizationFilter.authorizeRoles(1), async (req, res) => {

    const output = await UsersRepository.userCountByRole();
    console.log(output)

    ResponseFilter.setResponseDetails(res, 200, output.map(out => new Graf2Body(out)));
});

Router.get('/graf3', authorizeAndExtractTokenAsync,  AuthorizationFilter.authorizeRoles(1), async (req, res) => {

    const output = await UsersRepository.postsByEachUser();
    console.log(output)

    ResponseFilter.setResponseDetails(res, 200, output.map(out => new Graf3Body(out)));
});

Router.delete('/erase/:id', authorizeAndExtractTokenAsync,  AuthorizationFilter.authorizeRoles(1), async (req, res) => {

    const users = await UsersRepository.delUserByName(req.params.id);
    console.log(users)

    ResponseFilter.setResponseDetails(res, 201, new UserRegisterRepsonse(users));
});

Router.put('/change/', authorizeAndExtractTokenAsync,  AuthorizationFilter.authorizeRoles(1), async (req, res) => {

    const userBody = new UserBody(req.body);
    const user = await UsersRepository.changeUserByName(req.body.username, req.body.username1, req.body.role_id);

    ResponseFilter.setResponseDetails(res, 201, new UserRegisterRepsonse(user));
});

Router.get('/activare/:token', async (req, res) => {

    const users = await UsersRepository.getAllAsync();
    const token = req.params.token
    const decoded_token = await verifyAndDecodeDataAsync(token)
    req.user = decoded_token
    console.log(decoded_token)
    const user = await UsersRepository.activateAsync(req.user.userId);
    ResponseFilter.setResponseDetails(res, 201, new UserRegisterRepsonse(user));
});

module.exports = Router;