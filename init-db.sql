DROP TABLE IF EXISTS user_ CASCADE;
CREATE TABLE user_ (
    id SERIAL UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255)
);

DROP TYPE IF EXISTS action CASCADE;
CREATE TYPE action AS ENUM ('add', 'edit');

DROP TABLE IF EXISTS user_log CASCADE;
CREATE TABLE user_log (
    id SERIAL UNIQUE,
    user_id INTEGER NOT NULL,
    action action NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES user_(id)
);

DROP TABLE IF EXISTS problematic_user;
CREATE TABLE problematic_user (
    id SERIAL UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL,
    problems BOOLEAN DEFAULT TRUE,
    CONSTRAINT age CHECK (age >= 0 AND age <= 100)
);

-- INSERT INTO problematic_user (
--     SELECT
--         generate_series(1, 10),
--         MD5(RANDOM()::TEXT),
--         MD5(RANDOM()::TEXT),
--         TRUNC(RANDOM() * 100)
-- )

