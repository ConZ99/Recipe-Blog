const ServerError = require('./ServerError.js');

class PostPostBody {
    constructor (body) {
        this.poster = body.poster
        this.time_posted = body.time_posted
        this.time_modified = body.time_modified
        this.content = body.content
        this.views = body.views
        this.title = body.title
    }

    get Title () {
        return this.title;
    }

    get Poster () {
        return this.poster;
    }

    get Time_posted () {
        return this.time_posted;
    }

    get Time_modified () {
        return this.time_modified;
    }

    get Content () {
        return this.content;
    }

    get Views () {
        return this.views;
    }
}

class PostPutBody extends PostPostBody {
    constructor (body, id) {
        super(body);
        this.id = parseInt(id);
    }

    get Id () {
        return this.id;
    }
}

class PostResponse {
    constructor(post) {
        this.id = post.id;
        this.poster = post.poster;
        this.title = post.title;
        this.content = post.content;
        this.time_posted = post.time_posted;
        this.time_modified = post.time_modified;
        this.views = post.views;
    }
}

module.exports =  {
    PostPostBody,
    PostPutBody,
    PostResponse
}