#!/bin/bash
set -e
npm run build
env PGUSER=api PGHOST=localhost PGDATABASE=user_history PGPORT=5433 PGPASSWORD=12345 npm start
