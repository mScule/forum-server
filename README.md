# Forum server - Setup

## Prerequisites
***Check that you are in the project's main directory!***

### Node.js
Try start Node.js by writing `node` in terminal.
Check that you have version ***16.14.0*** installed. 
Exit node by pressing **CTRL + C** twice.

### Npm packages
Install following npm packages by writing given lines in terminal:
#### Express.js
```console
npm install express@4.17.3
```

#### MySQL
```console
npm install mysql@2.18.1
```

#### Multer
```console
npm install multer@1.4.4
```

#### Nodemon
```console
npm install nodemon@2.0.15
```

#### BodyParser
```console
npm install body-parser@1.19.2
```

#### CookieParser
```console
npm install cookie-parser@1.4.6
```

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
        "database": "database name here"
    }
}
```

## Running the server
Start server by writing `npm start` in the terminal
Stop the server with **CTRL + C**.
