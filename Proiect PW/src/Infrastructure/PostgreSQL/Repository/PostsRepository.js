const {
    queryAsync
} = require('..');

const user = async(roleId) => {
    console.info ('luam userul');
    
    const user = await queryAsync('SELECT username FROM users WHERE id = $1', [roleId]);
    return user[0];
};

const getAllAsync = async() => {
    console.info ('Getting all posts from database');
    
    const sorted_posts = await queryAsync('SELECT * FROM posts where id != 0 order by views desc');
    console.log(sorted_posts)
    const pinned = await queryAsync('SELECT * FROM posts where id = 0');
    console.log(pinned)
    if(pinned.length > 0 && sorted_posts.length > 0)
        sorted_posts.unshift(pinned[0])
    else if (pinned.length > 0)
        return pinned
    console.log(sorted_posts)
    return sorted_posts
};

const addAsync = async (title, content, poster) => {
    console.info(`Adding post ${title}`);

    const posts = await queryAsync('INSERT INTO posts (poster, time_posted, time_modified, title, content, views) VALUES ($1, NOW(), NOW(), $2, $3, 0) RETURNING id, title, poster, content, time_modified', [poster, title, content]);
    return posts[0];
};

const getByIdAsync = async (id) => {
    console.info(`Getting post with title ${id}`)

    const posts = await queryAsync(`SELECT * FROM posts WHERE id = $1`, [id]);
    return posts[0];
}

const updateByIdAsync = async (id, content) => {
    console.info(`Updating post with title ${id}`)

    const posts = await queryAsync('UPDATE posts SET content = $1, time_modified = NOW() WHERE id = $2 RETURNING *', [content, id]);
    return posts[0];
}

const viewAsync = async (id) => {
    console.info(`Viewing post with title ${id}`)
    const views = (await queryAsync('SELECT views FROM posts WHERE id = $1', [id]))[0].views
    console.log(views)
    const viewed = views + 1

    const user = (await queryAsync('SELECT poster FROM posts WHERE id = $1', [id]))[0].poster
    console.log("Userul este:" + user)
    const user_views = (await queryAsync('SELECT views FROM users WHERE username = $1', [user]))[0].views
    console.log(user_views)
    const users_viewed = user_views + 1
    const user_view = await queryAsync('UPDATE users SET views = $2 WHERE username = $1 RETURNING *', [user, users_viewed]);

    const posts = await queryAsync('UPDATE posts SET views = $2 WHERE id = $1 RETURNING *', [id, viewed]);
    return posts[0];
}

const pinByIdAsync = async (id) => {
    console.info(`Pinning post with id ${id}`)

    const max_id = (await queryAsync('SELECT MAX(id) FROM posts'))[0].max
    console.info('id maxim: ' + max_id)
    await queryAsync('UPDATE posts SET id = -1 WHERE id = 0');
    await queryAsync('UPDATE posts SET id = 0 WHERE id = $1', [id]);
    await queryAsync('UPDATE posts SET id = $1 WHERE id = -1', [id]);
    const fin = await queryAsync('select * from posts where id = 0');

    return fin;
}

const deleteByIdAsync = async (id) => {
    console.info(`Deleting the post with id ${id} from database async...`);

    const authors = await queryAsync('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);
    return authors[0];
    
};

module.exports = {
    getAllAsync,
    addAsync,
    getByIdAsync,
    updateByIdAsync,
    deleteByIdAsync,
    viewAsync,
    pinByIdAsync,
    user
}