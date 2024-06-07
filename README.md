# Run

- user - `npm run watch`
- userHistory - `npm run watch`
- problematic-user - `npm run start:dev`

# Database

- the `/init-db.sql` file is the db dump.
- username - "em"
- password - "123"
- db name - "em"

# Endpoints

## Users

- `http://localhost:8000/user` (POST) - create a user\
request body:
```
{
    "email": "",
    "password": "",
    "lastName": "",
    "firstName": "",
    "middleName": ""
}
```
- `http://localhost:8000/user/:userId` (PUT) - update a user with the specified id\
request body:
```
`{
    "email": "",
    "password": "",
    "lastName": "",
    "firstName": "",
    "middleName": ""
}`
```
- `http://localhost:8000/user` (GET) - get a list of all users

## User history

- `http://localhost:8001/user-history` (GET) - the "ручка" to get logs about users.\
parameters:
    - `page` - specifies a page to get. All of them if omitted.
    - `userId` - specifies a user to get logs for. For all of them if omitted.

## Problematic users

- `http://localhost:3000/problematic-users/free-from-problems/:userId` (PATCH) - make a user problem-free and get a number of problematic users


