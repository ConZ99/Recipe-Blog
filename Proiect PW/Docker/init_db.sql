CREATE TABLE IF NOT EXISTS posts (
    id serial PRIMARY KEY,
    poster varchar NOT NULL,
    time_posted date NOT NULL,
    time_modified date NOT NULL,
    title varchar NOT NULL,
    content varchar NOT NULL,
    views integer NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id serial PRIMARY KEY,
    username varchar NOT NULL UNIQUE,
    email varchar NOT NULL,
    password varchar NOT NULL,
    role_id integer NOT NULL,
    joined date NOT NULL,
    views integer NOT NULL,
    activated integer
);