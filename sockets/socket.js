const { userConneted, userDisConneted, saveMessage, sendNotifications, getUserTyping, updateLastmsgRoom, setMsgRead } = require('../controllers/socket');
const { io } = require('../index');


// Mensajes de Sockets
io.on('connection', client => {
    console.log(`cliente conectado`);
    console.log(client.handshake.headers['organization_uid']);

    // const [validated, uid] = checkJWT(client.handshake.headers['x-token']);
    // if (!validated)  return client.disconnect();

    const organization_uid = client.handshake.headers['organization_uid'];
    const user_uid = client.handshake.headers['user_uid'];

    // client set online
    userConneted(user_uid);

    //ingresar el usuario a la sala general de la organization
    client.join(organization_uid);

    client.on('disconnect', () => { 
        userDisConneted(user_uid);
    });

    client.on('join-to-room', (payload) => { 
        //ingresar el usuario a una sala de chat
        client.join(payload.room);
    });

    client.on('leave-room', (payload) => { 
        //ingresar el usuario a una sala de chat
        client.leave(payload.room);
    });

    client.on('room-msg', async (payload) => { 

        let newMsg = await saveMessage(payload);
        console.log("room-msg room-msg room-msg");
        console.log(newMsg);
        await updateLastmsgRoom(payload.room, newMsg._id);
        io.to(payload.room).emit('room-msg', newMsg);
        io.to(organization_uid).emit('refresh-list-room');
        await sendNotifications(payload);
    });

    client.on('user-typing', async (payload) => { 
        let userTyping = await getUserTyping(payload['user']);
        io.to(payload.room).emit('user-typing', userTyping);
    });

    client.on('refresh-list-room', (payload) => { 
        io.to(organization_uid).emit('refresh-list-room');
    });

    client.on('set-msg-read', (payload) => { 
        console.log("############## set-msg-read ##############");
        setMsgRead(payload.room, user_uid);
    });
});