This service collects events from another service from repository [test-task-users-js](https://github.com/anton-yak/test-task-users-js)

How to run service:
```bash
docker compose build && docker compose up
```

If you have node.js installed, you can also run service locally using commands:
```bash
npm install
./run_locally.sh
docker compose up db -d
```
