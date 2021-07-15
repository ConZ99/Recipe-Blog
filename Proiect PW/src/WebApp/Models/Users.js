const ServerError = require('./ServerError.js');

class UserBody {
    constructor (body) {
        this.id = body.id;

        this.username = body.username;
    
        this.password = body.password;

        this.email = body.email;

        this.views = body.views;

        if (!body.role_id) {
            this.role_id = 3;
        }
        else
        {
            this.role_id = body.role_id;
        }
    }

    get Username () {
        return this.username;
    }

    get Password () {
        return this.password;
    }

    get Role () {
        return this.role_id;
    }

    get Views () {
        return this.views;
    }
}

class UserRegisterRepsonse {
    constructor(user) {
        this.username = user.username;
        this.email = user.email;
        if (!user.id) 
            this.id = user.id;
        if (!user.role_id) 
            this.id = user.role_id;
    }
}
class UserLoginResponse {
    constructor(token, role, username) {
        this.role_id = role;
        this.token = token;
        this.username = username;
    }
}


class Graf1Body {
    constructor (body) {
        console.log(body)
        if(body.role_id == 1)
            this.label = "Admin"
        if(body.role_id == 2)
            this.label = "Moderator"
        if(body.role_id == 3)
            this.label = "User"
        this.y = parseInt(body.views);
    }
}

class Graf2Body {
    constructor (body) {
        console.log(body)
        if(body.role_id == 1)
            this.label = "Admin"
        if(body.role_id == 2)
            this.label = "Moderator"
        if(body.role_id == 3)
            this.label = "User"
        this.y = parseInt(body.users);
    }
}

class Graf3Body {
    constructor (body) {
        console.log(body)
        this.label = body.username
        this.y = parseInt(body.postari);
    }
}
module.exports =  {
    UserBody,
    UserLoginResponse,
    UserRegisterRepsonse,
    Graf1Body,
    Graf2Body,
    Graf3Body
}