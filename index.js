const express = require('express');
const path = require('path');
require('dotenv').config();

// DB Config
const { dbConnection } = require('./database/config');
dbConnection();


// app express
const app = express();

// lectura de http

app.use(express.json());

// node server
const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);
require('./sockets/socket');



// Path publico
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));


// definicion de rutas
app.use('/api/login', require('./routes/auth'))
app.use('/api/users', require('./routes/user'))
app.use('/api/messages', require('./routes/message'))


server.listen(process.env.PORT, (error) => {

    if (error) throw new Error(error);

    console.log(`Servidor corriendo en el puerto`, process.env.PORT);
});