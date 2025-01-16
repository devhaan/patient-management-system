1. npm i
2. env has to store in both src folder and config folder
   example:
   DB_URL=mongodb://localhost:27017/test
   JWT_SECRET=your_jwt_secret_key
   PORT=6000

3)  set in package.json
    "scripts": {
    "start": "nodemon ./src/server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
    },
4)  npm run start

then refer postman collection and test all mention relationships between roles based curd operation
