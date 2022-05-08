# Forum server - Setup

## Prerequisites
***Check that you are in the project's main directory!***

### Node.js
Try to start Node.js by writing `node` in the terminal.
Check that you have version ***16.14.0*** installed. 
Exit node by pressing **CTRL + C** twice.

### Npm packages
Install all of the required packages with the command `npm install`

If the command above doesn't work, try to install the packages with the following command:
```console
npm install express@4.17.3 mysql@2.18.1 multer@1.4.4 nodemon@2.0.15 body-parser@1.19.2 cookie-parser@1.4.6 uuid@8.3.2 swagger-jsdoc@6.2.1 swagger-ui-express@4.3.0 cors@2.8.5 memory-cache@0.2.0
```

### SQL server setup
Run the ***forum-db-creator.sql*** file under the /sql folder in a SQL server to create a database.

### Server config
Create a file called ***server-config.json*** in the project's main directory 
and add the following lines to it:
```json
{
    "server": {
        "port": 8081
    },
    "mysql": {
        "host": "hostname here",
        "user": "username here",
        "password": "password here",
        "database": "forum_db"
    }
}
```

## Running the server
Start the server by writing `npm start` in the terminal.
Stop the server with **CTRL + C**. <br><br>

# REST API Documentation

When the server is running, go to the URL path `/api-docs` on the server's webpage to see the Swagger UI REST API documentation.

Here is the documentation on it's own:

```
/login:
  put:
    summary: Logs a user in
    consumes:
      - application/json
    parameters:
      - in: body
        name: user
        description: The user to log in.
        schema:
          type: object
          required:
            - name
            - password
          properties:
            name:
              type: string
            password:
              type: string
    responses:
      201:
        description: A user was logged in. A login cookie was created and linked to the logged-in user in the database.
        content:
          application/json:
            schema:
              type: array
              items:
                type: object
                properties:
                  user_id:
                    type: integer
                  name:
                    type: string
                  email:
                    type: string
                  image:
                    type: string
                    format: binary
                    nullable: true
                  disabled:
                    type: object
                    properties:
                      type:
                        type: string
                      data:
                        type: array
                        items:
                          type: integer
      401:
        description: Login failed
      500:
        description: Some error occured in a database query.

/logout:
  put:
    summary: Logs a user out
    responses:
      200:
        description: A user was logged out and a login cookie was cleared.
        content:
          text/plain:
            schema:
              type: string
              example: "Logout successful"
      202:
        description: The request was accepted to be used in a database query.
      404:
        description: Error logging out
        content:
          text/plain:
            schema:
              type: string
              example: "Error logging out! ..."

/publications:
  post:
    summary: Creates a publication
    consumes:
      - application/json
    parameters:
      - in: cookie
        name: forum_api_key
        description: A cookie to identify the currently logged-in user
        schema:
          type: string
          example: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
      - in: body
        name: publication
        description: The publication to be created
        schema:
          type: object
          required:
            - type
            - title
            - content
          properties:
            type:
              type: string
            title:
              type: string
            content:
              type: string
            reply_to_id:
              type: integer
    responses:
      201:
        description: A new publication was created.
        content:
          text/plain:
            schema:
              type: string
              example: "Publication post result: ..."
      202:
        description: The request was accepted be used in a database query.
      401:
        description: Error creating a publication
        content:
          text/plain:
            schema:
              type: string
              example: "Publication post result: ..."
      500:
        description: An error occurred in the database query.
        content:
          text/plain:
            schema:
              type: string
              example: "Publication post result: Error: ..."

/publications put:
  put:
    summary: Modifies a publication's private value
    consumes:
      - application/json
    parameters:
      - in: cookie
        name: forum_api_key
        description: A cookie to identify the currently logged-in user
        schema:
          type: string
          example: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
      - in: body
        name: publication
        description: The publication to be modified
        schema:
          type: object
          required:
            - private
            - publication_id
          properties:
            private:
              type: integer
            publication_id:
              type: string
    responses:
      200:
        description: A publication was modified.
        content:
          text/plain:
            schema:
              type: string
              example: "Publication put: ..."
      202:
        description: The request was accepted to be used in a database query.
      404:
        description: No publications found
        content:
          text/plain:
            schema:
              type: string
              example: "Publication put: ..."
      500:
        description: An error occurred in the database query.
        content:
          text/plain:
            schema:
              type: string
              example: "Publication put: Error: ..."

/publications delete:
  delete:
    summary: Deletes a publication
    consumes:
      - application/json
    parameters:
      - in: body
        name: publication
        description: The publication to be deleted
        schema:
          type: object
          required:
            - publication_id
          properties:
            publication_id:
              type: integer
    responses:
      200:
        description: A publication was deleted.
        content:
          text/plain:
            schema:
              type: string
              example: "Publication delete: ..."
      202:
        description: The request was accepted to be used in a database query.
      404:
        description: No publication with the specified publication_id found
        content:
          text/plain:
            schema:
              type: string
              example: "Publication delete: ..."
      500:
        description: An error occurred in the database query.
        content:
          text/plain:
            schema:
              type: string
              example: "Publication delete: Error: ..."

/publications get:
  get:
    summary: Gets publications
      Insert "any" in any of the query parameters to not take the values of those columns into account.
    consumes:
      - application/json
    parameters:
      - in: query
        name: publication_id
        required: true
        schema:
            type: integer
        description: The publication's ID
      - in: query
        name: user_id
        required: true
        schema:
            type: integer
        description: The user's ID who created the publication
      - in: query
        name: type
        required: true
        schema:
          type: string
        description: The type of publication, a "post" or a "comment"
      - in: query
        name: title
        required: true
        schema:
          type: string
        description: The publication's title
      - in: query
        name: content
        required: true
        schema:
          type: string
        description: The publication's content
      - in: query
        name: private
        required: true
        schema:
          type: integer
        description: Is the publication private or public.
          The value "0" means the publication is public and "1" means the publication is private.
      - in: query
        name: date_max
        schema:
          type: string
        description: The publication's maximum date of creation
      - in: query
        name: date_min
        schema:
          type: string
        description: The publication's minimum date of creation
      - in: query
        name: reply_to_id
        required: true
        schema:
          type: integer
        description: If the publication is a reply, the ID of the publication this publication refers to.
    responses:
      200:
        description: Publication(s) found
        content:
          application/json:
            schema:
              type: array
              items:
                type: object
                properties:
                  publication_id:
                    type: integer
                  user_id:
                    type: integer
                  type:
                    type: string
                  title:
                    type: string
                  private:
                    type: object
                    properties:
                      type:
                        type: string
                      data:
                        type: array
                        items:
                          type: integer
                  date:
                    type: string
                  reply_to_id:
                    type: integer
      202:
        description: The request was accepted to be used in a database query.
      404:
        description: No data found
        content:
          text/plain:
            schema:
              type: string
              example: "No data found"
      500:
        description: An error occurred in the database query.
        content:
          text/plain:
            schema:
              type: string
              example: "Error: ..."

/users:
  post:
    summary: Creates a new user account
    consumes:
      - application/json
    parameters:
      - in: body
        name: user
        description: The user to be created
        schema:
          type: object
          required:
            - name
            - email
            - password
            - disabled
          properties:
            name:
              type: string
            email:
              type: string
            password:
              type: string
            disabled:
              type: integer
    responses:
      201:
        description: A new user was created.
        content:
          application/json:
            schema:
              type: object
              properties:
                fieldCount:
                  type: integer
                affectedRows:
                  type: integer
                insertId:
                  type: integer
                serverStatus:
                  type: integer
                warningCount:
                  type: integer
                message:
                  type: string
                protocol41:
                  type: boolean
                changedRows:
                  type: integer
      202:
        description: The request was accepted to be used in a database query.
      500:
        description: An error occurred in the database query.
        content:
          text/plain:
            schema:
              type: string
              example: "Error: ..."

/users put:
  put:
    summary: Modifies a user's info
    consumes:
      - application/json
    parameters:
      - in: cookie
        name: forum_api_key
        description: A cookie to identify the currently logged-in user
        schema:
          type: string
          example: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
      - in: body
        name: user
        description: The user to be modified
        schema:
          type: object
          required:
            - username_new
            - email_new
            - password_new
            - disabled
            - email_current
            - password_current
          properties:
            username_new:
              type: string
            email_new:
              type: string
            password_new:
              type: string
            disabled:
              type: integer
            email_current:
              type: string
            password_current:
              type: string
    responses:
      200:
        description: A user was modified.
        content:
          application/json:
            schema:
              type: object
              properties:
                fieldCount:
                  type: integer
                affectedRows:
                  type: integer
                insertId:
                  type: integer
                serverStatus:
                  type: integer
                warningCount:
                  type: integer
                message:
                  type: string
                protocol41:
                  type: boolean
                changedRows:
                  type: integer
      202:
        description: The request was accepted to be used in a database query.
      404:
        description: No user found
        content:
          text/plain:
            schema:
              type: string
              example: "No data modified"
      500:
        description: An error occurred in the database query.
        content:
          text/plain:
            schema:
              type: string
              example: "Error: ..."

/users delete:
  delete:
    summary: Deletes a user
    consumes:
      - application/json
    parameters:
      - in: cookie
        name: forum_api_key
        description: A cookie to identify the currently logged-in user
        schema:
          type: string
          example: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
      - in: body
        name: user
        description: The user to be deleted
        schema:
          type: object
          required:
            - email
            - password
          properties:
            email:
              type: string
            password:
              type: string
    responses:
      200:
        description: A user was deleted.
        content:
          application/json:
            schema:
              type: object
              properties:
                fieldCount:
                  type: integer
                affectedRows:
                  type: integer
                insertId:
                  type: integer
                serverStatus:
                  type: integer
                warningCount:
                  type: integer
                message:
                  type: string
                protocol41:
                  type: boolean
                changedRows:
                  type: integer
      202:
        description: The request was accepted to be used in a database query.
      404:
        description: No user found
        content:
          text/plain:
            schema:
              type: string
              example: "No data modified"
      500:
        description: An error occurred in the database query.
        content:
          text/plain:
            schema:
              type: string
              example: "Error: ..."

/users get:
  get:
    summary: Gets the current user's data or gets any other users' data if a "get_current_user" parameter 
      which value equals "false" is inserted as a parameter.
      Insert "any" in any of the other query parameters to not take the values of those columns into account.
    consumes:
      - application/json
    parameters:
      - in: query
        name: get_current_user
        schema:
            type: boolean
        description: Set the value to "false" if you want to get other than the currently logged-in user's data.
      - in: query
        name: user_id
        schema:
            type: integer
        description: A specific user's ID
      - in: query
        name: name
        schema:
          type: string
        description: A specific user's name
      - in: query
        name: email
        schema:
          type: string
        description: A specific user's email
      - in: query
        name: disabled
        schema:
          type: integer
        description: Is the user account disabled from use or not. 
          The value "0" means the account is enabled and "1" means the account is disabled.
    responses:
      200:
        description: User(s) found
        content:
          application/json:
            schema:
              type: array
              items:
                type: object
                properties:
                  user_id:
                    type: integer
                  name:
                    type: string
                  email:
                    type: string
                  image:
                    type: string
                    format: binary
                  disabled:
                    type: object
                    properties:
                      type:
                        type: string
                      data:
                        type: array
                        items:
                          type: integer
      202:
        description: The request was accepted to be used in a database query.
      404:
        description: No data found
        content:
          text/plain:
            schema:
              type: string
              example: "No data found"
      500:
        description: An error occurred in the database query.
        content:
          text/plain:
            schema:
              type: string
              example: "Error: ..."

/votes:
  post:
    summary: Creates a new vote
    consumes:
      - application/json
    parameters:
      - in: cookie
        name: forum_api_key
        description: A cookie to identify the currently logged-in user
        schema:
          type: string
          example: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
      - in: body
        name: vote
        description: The vote to be created
        schema:
          type: object
          required:
            - publication_id
            - vote
          properties:
            publication_id:
              type: integer
            vote:
              type: string
    responses:
      201:
        description: A new vote was created.
        content:
          application/json:
            schema:
              type: object
              properties:
                fieldCount:
                  type: integer
                affectedRows:
                  type: integer
                insertId:
                  type: integer
                serverStatus:
                  type: integer
                warningCount:
                  type: integer
                message:
                  type: string
                protocol41:
                  type: boolean
                changedRows:
                  type: integer
      202:
        description: The request was accepted to be used in a database query.
      500:
        description: An error occurred in the database query.
        content:
          text/plain:
            schema:
              type: string
              example: "Error: ..."

/votes put:
  put:
    summary: Modifies a vote
    consumes:
      - application/json
    parameters:
      - in: cookie
        name: forum_api_key
        description: A cookie to identify the currently logged-in user
        schema:
          type: string
          example: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
      - in: body
        name: vote
        description: The vote to be modified
        schema:
          type: object
          required:
            - vote
            - publication_id
          properties:
            vote:
              type: string
            publication_id:
              type: integer
    responses:
      200:
        description: A vote was modified.
        content:
          application/json:
            schema:
              type: object
              properties:
                fieldCount:
                  type: integer
                affectedRows:
                  type: integer
                insertId:
                  type: integer
                serverStatus:
                  type: integer
                warningCount:
                  type: integer
                message:
                  type: string
                protocol41:
                  type: boolean
                changedRows:
                  type: integer
      202:
        description: The request was accepted to be used in a database query.
      404:
        description: No vote found
        content:
          text/plain:
            schema:
              type: string
              example: "No data modified"
      500:
        description: An error occurred in the database query.
        content:
          text/plain:
            schema:
              type: string
              example: "Error: ..."

/votes delete:
  delete:
    summary: Deletes a vote
    consumes:
      - application/json
    parameters:
      - in: cookie
        name: forum_api_key
        description: A cookie to identify the currently logged-in user
        schema:
          type: string
          example: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
      - in: body
        name: vote
        description: The vote to be deleted
        schema:
          type: object
          required:
            - publication_id
          properties:
            publication_id:
              type: integer
    responses:
      200:
        description: A vote was deleted.
        content:
          application/json:
            schema:
              type: object
              properties:
                fieldCount:
                  type: integer
                affectedRows:
                  type: integer
                insertId:
                  type: integer
                serverStatus:
                  type: integer
                warningCount:
                  type: integer
                message:
                  type: string
                protocol41:
                  type: boolean
                changedRows:
                  type: integer
      202:
        description: The request was accepted to be used in a database query.
      404:
        description: No vote found
        content:
          text/plain:
            schema:
              type: string
              example: "No data modified"
      500:
        description: An error occurred in the database query.
        content:
          text/plain:
            schema:
              type: string
              example: "Error: ..."

/votes get:
  get:
    summary: Gets votes.
      Insert "any" in any of the query parameters to not take the values of those columns into account.
    consumes:
      - application/json
    parameters:
      - in: query
        name: user_id
        schema:
            type: integer
        description: The user's ID who cast the vote(s).
      - in: query
        name: publication_id
        schema:
            type: integer
        description: The publication's ID which the vote(s) is/are associated with.
      - in: query
        name: vote
        schema:
          type: string
        description: The type of votes to get
    responses:
      200:
        description: Vote(s) found
        content:
          application/json:
            schema:
              type: array
              items:
                type: object
                properties:
                  publication_id:
                    type: integer
                  user_id:
                    type: string
                  vote:
                    type: string
      202:
        description: The request was accepted to be used in a database query.
      404:
        description: No data found
        content:
          text/plain:
            schema:
              type: string
              example: "No data found"
      500:
        description: An error occurred in the database query.
        content:
          text/plain:
            schema:
              type: string
              example: "Error: ..."
```