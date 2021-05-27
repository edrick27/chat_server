const { userConneted, userDisConneted, saveMessage } = require('../controllers/socket');
const { checkJWT } = require('../helpers/jwt');
const { io } = require('../index');


// Mensajes de Sockets
io.on('connection', client => {
    console.log(`cliente conectado`);

    console.log(client.handshake.headers['x-token']);

    const [validated, uid] = checkJWT(client.handshake.headers['x-token']);

    console.log(validated);

    if (!validated)  return client.disconnect();

    // client authenticated
    userConneted(uid);

    //ingresar el usuario a una sala
    client.join(uid);

    // client.to(uid).emit('', () => {

    // });

    client.on('disconnect', () => { 
        console.log(`cliente desconectado`);
        userDisConneted(uid);
    });

    client.on('mensaje', (msj) => { 
        console.log(`llego el msj ${msj['nombre']}`);

        io.emit('mensaje', { admin: 'nuevo mensaje' });
    });

    client.on('emitir-mensaje', (payload) => { 

        io.emit('nuevo-mensaje', payload);
    });

    client.on('personal-msg', async (payload) => { 

        console.log(`personal-msg: ${payload}`);
        console.log(payload);

        await saveMessage(payload);
        io.to(payload.to).emit('personal-msg', payload);
        // io.emit('nuevo-mensaje', payload);
    });
});