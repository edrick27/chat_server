const { userConneted, userDisConneted, saveMessage, sendNotifications } = require('../controllers/socket');
const { checkJWT } = require('../helpers/jwt');
const { io } = require('../index');


// Mensajes de Sockets
io.on('connection', client => {
    console.log(`cliente conectado`);
    console.log(client.handshake.headers['uid']);

    // const [validated, uid] = checkJWT(client.handshake.headers['x-token']);
    const uid = client.handshake.headers['uid'];

    // console.log(validated);
    // if (!validated)  return client.disconnect();

    // client set online
    // userConneted(uid);

    //ingresar el usuario a una sala
    client.join(uid);


    client.on('disconnect', () => { 
        console.log(`cliente desconectado`);
        // userDisConneted(uid);
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
});