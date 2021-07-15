const express = require('express');

const PostsRepository = require('../../Infrastructure/PostgreSQL/Repository/PostsRepository.js');
const ServerError = require('../Models/ServerError.js');
const { PostPostBody, PostPutBody, PostResponse } = require('../Models/Post.js');

const ResponseFilter = require('../Filters/ResponseFilter.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');

const Router = express.Router();

Router.post('/addPost', async (req, res) => {
    
    const postBody = new PostPostBody(req.body);
    const user = await PostsRepository.user(req.user.userId)
    console.log(user.username)
    postBody.poster = user.username
    console.log(req.body)
    console.log(postBody)

    const post = await PostsRepository.addAsync(postBody.title, postBody.content, postBody.poster);

    ResponseFilter.setResponseDetails(res, 201, new PostResponse(post), req.originalUrl);
});

Router.get('/allPosts', async (req, res) => {

    const posts = await PostsRepository.getAllAsync();

    ResponseFilter.setResponseDetails(res, 200, posts.map(post => new PostResponse(post)));
});

Router.get('/getPost/:id', async (req, res) => {
    let {
        id
    } = req.params;

    id = parseInt(id);
    console.log(id)
    const post = await PostsRepository.viewAsync(id);
    const post_aux = await PostsRepository.getByIdAsync(id);
    
    if (!post_aux) {
        throw new ServerError(`Post with id ${id} does not exist!`, 404);
    }

    ResponseFilter.setResponseDetails(res, 200, new PostResponse(post_aux));
});

Router.put('/editPost/:id', AuthorizationFilter.authorizeRoles(1, 2), async (req, res) => {
    const postBody = new PostPutBody(req.body, req.params.id);
    console.log("Edit Post: " + postBody)

    const post = await PostsRepository.updateByIdAsync(postBody.id, postBody.content);
        
    if (!post) {
        throw new ServerError(`Post with id ${id} does not exist!`, 404);
    }

    ResponseFilter.setResponseDetails(res, 200, new PostResponse(post));
});

Router.put('/pinPost/:id', AuthorizationFilter.authorizeRoles(1, 2), async (req, res) => {

    const postBody = new PostPutBody(req.body, req.params.id);

    const post = await PostsRepository.pinByIdAsync(postBody.id);

    ResponseFilter.setResponseDetails(res, 200, new PostResponse(post));
});

Router.delete('/deletePost/:id', AuthorizationFilter.authorizeRoles(1, 2), async (req, res) => {
    const {
        id
    } = req.params;
    
    const post = await PostsRepository.deleteByIdAsync(parseInt(id));

    ResponseFilter.setResponseDetails(res, 204, "Entity deleted succesfully");
});

module.exports = Router;