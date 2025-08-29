CREATE TABLE aegis(
    id SERIAL PRIMARY KEY,
    name VARCHAR(25),
    username TEXT NOT NULL,
    url TEXT,
    password TEXT NOT NULL
);