var path = require('path')
var http = require('http')
var express = require('express')
var socketio = require('socket.io')
var Filter = require('bad-words')
var { generateMessage , generateLocationMessage } = require('./utilis/message')
var { addUser , removeUser , getUser , getUserInRoom} = require('./utilis/users')
var app = express();
var server = http.createServer(app);
var io = socketio(server);

var port = process.env.PORT || 3000 ;

var publicDirectoryPath = path.join(__dirname,'../public');
app.use(express.static(publicDirectoryPath));

//==================Routes==========================================


io.on('connection',(socket)=>{
    console.log("New connection in web socket");
        
    socket.on('Join',({username,room},callback)=>{
        const {error , user} = addUser({id:socket.id,username,room})

        if(error){
            return callback(error)
        }
        const Room =user.room

        socket.join(Room) //to join the particular user its selected room

        socket.emit('sendMsgToClient',generateMessage("Admin","Welcome !"));

        socket.broadcast.to(Room).emit('sendMsgToClient',generateMessage( "Admin",user.username + " has joined the room ."));  
        
        io.to(user.room).emit('RoomData',{
            room:user.room,
            users:getUserInRoom(user.room)
        })
        callback()
    })
    
    socket.on('msgToServer',(msg,callback)=>{
        const user = getUser(socket.id)
        var filter = new Filter();
        if(filter.isProfane(msg)){
            return callback('Error: Profane words spotted !!!');
        }
            console.log(user.room)
            io.to(user.room).emit('sendMsgToClient',generateMessage(user.username,msg));
            callback('Delivered !!!');
        
    })

    socket.on('location',(loc,callback)=>{
        const user = getUser(socket.id)
        console.log(user.room);
        io.to(user.room).emit('locationMessage',generateLocationMessage(user.username,"https://www.google.com/maps?q="+loc.lati+","+loc.long));
        callback();
    })

    socket.on('disconnect',()=>{
        console.log("User Disconnected");
        const user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit('sendMsgToClient',generateMessage("Admin",user.username+" Left !"));
            io.to(user.room).emit('RoomData',{
                room:user.room,
                users:getUserInRoom(user.room)
            })
        }
    })

})


server.listen(port,()=>{
    console.log('server listening on port '+port);
})