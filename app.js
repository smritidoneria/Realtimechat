


const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "http://127.0.0.1:5500",  // Adjust to your client's origin
        methods: ["GET", "POST"]
    }
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://dev5548.d39umk436wvtm.amplifyapp.com'); // Replace with your Amplify app URL
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
  
const PORT=process.env.PORT||8000
const users={} 
io.on('connection', function (socket) {
    console.log("a user connected");

    // Set up event listener for 'new-user' when a user connects
    socket.on('new-user', name1 => {
        console.log(name1)
        users[socket.id] = name1;
        socket.broadcast.emit('user-joined', name1);
    });
    socket.on('send', message => {
        console.error(message)
        const timestamp = new Date().toLocaleTimeString();

       // console.log("recieved:" ,message.message)
        socket.broadcast.emit('receive', { message:message, name: users[socket.id],time:timestamp });
        //console.log(message.message)
    });

    //for handling reaction
    socket.on('react', (reactionData) => {
        io.emit('message-reaction', reactionData);
      });
    

    // Set up a timeout to emit a custom event after 8 seconds
    setTimeout(function () {
        socket.emit('custom-event', { desc: 'ds' });
    }, 8000);

    socket.on('disconnect', () => {
        console.log('disconnected');
        const disconnectedUser = users[socket.id];
        console.log(disconnectedUser)
        if (disconnectedUser) {
            socket.broadcast.emit('left', disconnectedUser);
            delete users[socket.id];
        }
    });
    

    
});

http.listen(PORT, () => {
    console.log("server started on port 8000");  // Corrected port number in the log message
});
