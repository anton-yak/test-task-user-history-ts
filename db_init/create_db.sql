CREATE USER api WITH ENCRYPTED PASSWORD '12345';
CREATE DATABASE user_history;
GRANT ALL PRIVILEGES ON DATABASE user_history TO api;
\connect user_history

CREATE TABLE user_events (
    id serial PRIMARY KEY,
    user_id integer NOT NULL,
    event text NOT NULL CHECK (event IN ('create', 'update')),
    created_at timestamp NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO api;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO api;