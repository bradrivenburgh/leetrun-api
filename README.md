# LeetRun API

This is the API for the LeetRun client.

## Set up

Complete the following steps to run the API locally:

1. Clone this repository to your local machine `git clone LEETRUN-API_URL LEETRUN-API`
2. `cd` into the cloned repository
3. Make a fresh start of the git history for this project with `rm -rf .git && git init`
4. Install the node dependencies `npm install`
5. Move the example Environment file to `.env` that will be ignored by git and read by the express server `mv example.env .env` and add your own values
6. Provision a PostgreSQL DB
7. Run `npm run migrate`
8. Seed the DB tables `psql -U your_user_name -d your_db_name -f ./seeds/seed.leetrun_tables.sql`

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.

You will need to provision a PostgreSQL database on Heroku. All environmental variables above will need to set up in your Heroku config (e.g., `heroku config:set var=value`), along with the following variable: `PGSSLMODE=no-verify`.

### Provision and Seed the Heroku PG DB

1. Run `npm run migrate:production`
2. Get your credentials `heroku pg:credentials:url`
3. Connect to your Heroku database (`heroku pg:psql`)
4. Run `\i ./seeds/seed.leetrun_tables.sql`

## Endpoints

### /api/runs

- **Method:**

`GET`

- **URL Params:**

`api/runs/:run_entry_id`

- **Success Response:**

  **Code:** 200 <br />
  **Content**: `
  [
    {
      id: 1,
      user_name: "test-user-1",
      first_name: "Test 1",
      last_name: "User 1",
      password: "password",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 2,
      user_name: "test-user-2",
      first_name: "Test 2",
      last_name: "User 2",
      password: "password",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
  ]`

- **Error Response:**

  **Code:** 404 NOT FOUND <br />
  **Content:** 
  * `{ error: `Run entry does not exist` }`


- **Method:**

`POST`

- **URL Params:**

None

- **Success Response:**

  **Code:** 201 <br />
  **Content**: `
    {
      id: 1,
      user_name: "test-user-1",
      first_name: "Test 1",
      last_name: "User 1",
      password: "password",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    }`

- **Error Response:**

  **Code:** 401 UNAUTHORIZED <br />
  **Content:** 
  * `{"error":"Required properties are missing: [fields]`
  * `{ error: "Invalid property values provided: [field]" }`

  - **Method:**

`PATCH`

- **URL Params:**

`/api/runs/:run_entry_id`

- **Success Response:**

  **Code:** 204 <br />

- **Error Response:**

  **Code:** 404 NOT FOUND <br />
  **Content:** 
  * `{ error: `Run entry does not exist` }`


  - **Method:**

`DELETE`

- **URL Params:**

`/api/runs/:run_entry_id`

- **Success Response:**

  **Code:** 204 <br />

- **Error Response:**

  **Code:** 404 NOT FOUND <br />
  **Content:** 
  * `{ error: `Run entry does not exist` }`


### /api/auth/login

- **Method:**

`POST`

- **URL Params:**

None

- **Success Response:**

  **Code:** 200 <br />
  **Content**: `{"authToken":"some.jwt.token"}`

- **Error Response:**

  **Code:** 400 BAD REQUEST <br />
  **Content:** 
  * `{ error: "Incorrect user_name or password" }`
  * `{ error: "Missing '${field}' in request body" }`


### /api/auth/refresh

- **Method:**

`POST`

- **URL Params:**

None

- **Success Response:**

  **Code:** 200 <br />
  **Content**: `{"authToken":"some.jwt.token"}`

### /api/users

- **Method:**

`POST`

- **URL Params:**

None

- **Success Response:**

  **Code:** 201 <br />
  **Content**: `{
      id: 1,
      first_name: "First",
      last_name: "Last",
      user_name: "Runner",
      date_created: "2021-02-19T02:21:18.434Z",
    }`

- **Error Response:**

  **Code:** 400 BAD REQUEST <br />
  **Content:** 
  * `{ error: "Username already taken" }`
  * `{ error: "Password must be longer than 8 characters" }`
  * `{ error: "Password must be less than 72 characters" }`
  * `{ error: "Password must not start or end with empty spaces" }`
  * `{ error: "Password must contain one upper case, lower case, number and special character" }`
