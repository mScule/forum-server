# Forum server - Setup

## Prerequisites
***Check that you are in the project's main directory!***

### Node.js
Try start Node.js by writing `node` in terminal.
Check that you have version ***16.14.0*** installed. 
Exit node by pressing **CTRL + C** twice.

### Npm packages
Install all given packages with `npm install`

If it doesn't work for some reason install every package independently with following commands:
```console
npm install express@4.17.3
npm install mysql@2.18.1
npm install multer@1.4.4
npm install nodemon@2.0.15
npm install body-parser@1.19.2
npm install cookie-parser@1.4.6
```

### SQL server setup
Run ***forum-db-creator.sql*** query in the SQL server to create the sql server

### Server config
Create file called ***server-config.json*** in the project's main directory 
and add following contents to it:
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
Start server by writing `npm start` in the terminal
Stop the server with **CTRL + C**.
