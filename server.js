var app  = require('express')();
var http = require('http').createServer(app);
var io   = require('socket.io')(http);

users = [];
connections = []; 

app.get('/', (req, res)=>{
    res.sendFile(__dirname+'/client.html');
});


io.on('connection', (socket)=>{
    connections.push(socket); // Adding a new connection the connections array
    console.log("User Connected: %s socket connected", connections.length)

    // Disconnect
    socket.on('disconnect', (data)=>{
         
         users.splice(users.indexOf(socket.username), 1)
         updateUsernames();
        connections.splice(connections.indexOf(socket), 1); // Remove one connection from the connections array
        console.log("Disconnected: %s sockets connected", connections.length)
    })

    // Send Messages

    socket.on('send message', (data)=>{
        console.log(data);
        io.sockets.emit('new message', {msg: data, user: socket.username });
    })

    // New User
    socket.on('new user', function(data, callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    })

    function updateUsernames(){
        io.sockets.emit('get users', users); 
    }
    
})

http.listen(process.env.PORT || 3000,()=>{
    console.log(" Server running at port 3000........!"); 
})
 