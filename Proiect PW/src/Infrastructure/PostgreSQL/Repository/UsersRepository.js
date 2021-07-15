const {
    queryAsync
} = require('..');

const getAllAsync = async() => {
    console.info ('Getting all users from database');
    
    return await queryAsync('SELECT * FROM users');
};

const getAsync = async(id) => {
    console.info ('Getting user from database');
    
    const users = await queryAsync('SELECT * FROM users where id = $1', [id]);
    return users[0];
};

const addAsync = async (username, password, email, role) => {
    console.info(`Adding user ${username}`);

    const users = await queryAsync('INSERT INTO users (username, email, password, role_id, joined, views, activated) VALUES ($1, $2, $3, $4, NOW(), 0, 0) RETURNING id, username, role_id', [username, email, password, role]);
    return users[0];
};

const getByUsername = async (username) => {
    console.info(`Getting user with username ${username}`);
    
    const users = await queryAsync(`SELECT * FROM users WHERE username = $1`, [username]);
    return users[0];
};

const delUserByName = async (id) => {
    console.info(`Deleting user with username ${id}`);
    
    const users = await queryAsync(`DELETE FROM users WHERE id = $1 RETURNING username, email`, [id]);
    console.info(users[0])
    return users[0];
};

const changeUserByName = async (username, username1, role) => {
    console.info(`Changing user with username ${username} with ${username1}`);
    
    const users = await queryAsync(`UPDATE users set username = $2, role_id = $3 WHERE username = $1 RETURNING *`, [username, username1, role]);
    return users[0];
};

const activateAsync = async (username) => {
    console.info(`Activating user with username ${username}`);
    const users = await queryAsync('UPDATE users set activated = 1 WHERE username = $1 RETURNING username, email', [username])
    return users[0]
}

const viewsByRole = async () => {
    const output = await queryAsync('select role_id, sum(views) as views from users group by role_id')
    return output;
}

const userCountByRole = async () => {
    const output = await queryAsync('select role_id, count(username) as users from users group by role_id')
    return output;
}

const postsByEachUser = async () => {
    const output = await queryAsync('select u.username, count(p.title) as postari from users u, posts p where u.username = p.poster group by u.username')
    return output;
}

module.exports = {
    getAllAsync,
    addAsync,
    getByUsername,
    changeUserByName,
    delUserByName,
    activateAsync,
    getAsync,
    viewsByRole,
    userCountByRole,
    postsByEachUser
}