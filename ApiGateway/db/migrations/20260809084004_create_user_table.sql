-- +goose Up
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,          -- Prevent duplicate usernames
    email VARCHAR(255) NOT NULL UNIQUE,          -- Prevent duplicate emails
    password VARCHAR(255) NOT NULL,              -- Fits long hashed passwords (e.g., bcrypt)
    created_at TIMESTAMP DEFAULT NOW()           -- Automatically tracks registration time
);
-- +goose Down
drop table users;
