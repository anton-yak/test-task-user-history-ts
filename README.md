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

After starting up service you can access it by address http://localhost:8081

Example requests:

`GET /api/v1/user-events?userId=1&limit=5&offset=0`
___
`POST /api/v1/user-events`
```json
{
    "userId": 1,
    "event": "create",
    "changedFields": [
        {
            "fieldName": "email",
            "oldValue": "test@example.com",
            "newValue": "newtest@example.com"
        },
        {
            "fieldName": "password",
            "oldValue": "12345",
            "newValue": "qwerty"
        }
    ]
}
```
