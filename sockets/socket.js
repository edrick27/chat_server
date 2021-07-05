const { userConneted, userDisConneted, saveMessage, sendNotifications, getUserTyping, updateLastmsgRoom } = require('../controllers/socket');
const { io } = require('../index');


// Mensajes de Sockets
io.on('connection', client => {
    console.log(`cliente conectado`);
    console.log(client.handshake.headers['uid']);

    // const [validated, uid] = checkJWT(client.handshake.headers['x-token']);
    const uid = client.handshake.headers['uid'];
    const user_uid = client.handshake.headers['user_uid'];

    // if (!validated)  return client.disconnect();

    // client set online
    userConneted(user_uid);

    //ingresar el usuario a una sala
    client.join(uid);


    client.on('disconnect', () => { 
        userDisConneted(user_uid);
    });

    client.on('mensaje', (msj) => { 
        io.emit('mensaje', { admin: 'nuevo mensaje' });
    });

    client.on('emitir-mensaje', (payload) => { 

        io.emit('nuevo-mensaje', payload);
    });

    client.on('room-msg', async (payload) => { 

        let newMsg = await saveMessage(payload);
        await updateLastmsgRoom(payload.room, newMsg._id);
        io.to(payload.room).emit('room-msg', newMsg);
        await sendNotifications(payload);
    });

    client.on('user-typing', async (payload) => { 
        let userTyping = await getUserTyping(payload['user']);
        io.to(payload.room).emit('user-typing', userTyping);
    });
});