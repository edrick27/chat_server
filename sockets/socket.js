const { userConneted, userDisConneted, saveMessage, sendNotifications, getUserTyping } = require('../controllers/socket');
const { io } = require('../index');


// Mensajes de Sockets
io.on('connection', client => {
    console.log(`cliente conectado`);
    console.log(client.handshake.headers['uid']);

    // const [validated, uid] = checkJWT(client.handshake.headers['x-token']);
    const uid = client.handshake.headers['uid'];
    const user_uid = client.handshake.headers['user_uid'];

    // console.log(validated);
    // if (!validated)  return client.disconnect();

    // client set online
    userConneted(user_uid);

    //ingresar el usuario a una sala
    client.join(uid);


    client.on('disconnect', () => { 
        console.log(`cliente desconectado`);
        userDisConneted(user_uid);
    });

    client.on('mensaje', (msj) => { 
        console.log(`llego el msj ${msj['nombre']}`);

        io.emit('mensaje', { admin: 'nuevo mensaje' });
    });

    client.on('emitir-mensaje', (payload) => { 

        io.emit('nuevo-mensaje', payload);
    });

    client.on('room-msg', async (payload) => { 

        console.log(`room-msg: ${payload}`);
        console.log(payload);

        let newMsg = await saveMessage(payload);
        io.to(payload.room).emit('room-msg', newMsg);
        await sendNotifications(payload);
    });

    client.on('user-typing', async (payload) => { 

        console.log(`user-typing: ${payload}`);
        let userTyping = await getUserTyping(payload['user']);

        io.to(payload.room).emit('user-typing', userTyping);
    });
});