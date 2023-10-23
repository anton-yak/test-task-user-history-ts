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

CREATE TABLE user_field_history (
    id serial PRIMARY KEY,
    user_event_id integer REFERENCES user_events(id),
    field_name text NOT NULL,
    old_value text,
    new_value text
);

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO api;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO api;