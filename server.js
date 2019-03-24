const express = require("express");
// const mongoose = require("mongoose");
// const keys = require("./keys");
const app = express();
const server = require("http").createServer(app);

const io = require("socket.io").listen(server);



server.listen(3000);

// mongoose.connect(keys.mongoURI)
//     .then(() => console.log("MongoDB connected."))
//     .catch(err => console.error(err))

app.use(express.static('public'));

app.get("/", (request, respons) => {
    respons.sendFile(__dirname + "/public/index.html" );
    // respons.sendFile(__dirname + "/public/css/style.css");
});

app.get("/chat", (request, respons) => {
    respons.sendFile(__dirname + "/public/message.html" );
    // respons.sendFile(__dirname + "/public/css/style.css");
});

app.get("/help", (request, respons) => {
    respons.sendFile(__dirname + "/public/help.html" );
    // respons.sendFile(__dirname + "/public/css/style.css");
});

app.get("/profile", (request, respons) => {
    respons.sendFile(__dirname + "/public/profile.html" );
    // respons.sendFile(__dirname + "/public/css/style.css");
});

var users = [];
var connections = [];

io.sockets.on("connection", (socket) => {
    var clientIp = socket.request.connection.remoteAddress;
    var clientId = socket.id;
    console.log("Новый пользователь подключен " + clientIp + " : " + clientId);
    //console.log(socket.id);
    connections.push(clientIp);
    console.log(connections);
    // if(clientIp == "192.168.88.31"){
    //     socket.disconnect(true);
    //     console.log("You banned! " + clientIp);
    // }
    

    socket.on("disconnect", (data) => {
        connections.splice(connections.indexOf(socket), 1);
        console.log("Пользователь отключен " + clientIp);
    })

    socket.on("sendMess", (data, name) => {
        io.sockets.emit("addMess", {msg: data, user: name});
        console.log(clientId + " # " + clientIp +" : " + name + ": " + data);
    });

    socket.on("banUser", (data) => {
        var banIp = {
            ip: data
        };
        //banIp.ip.disconnect(true);
        for(var itemIp of connections){
            if(itemIp == banIp.ip){
                //socket.disconnect(true);
                io.sockets.emit("answer");
                console.log("You banned! : " + banIp.ip);
                // io.sockets.emit("disconnect");
            }
        }
        //socket.disconnect(true);
        // console.log("You banned! : " + banIp.ip);
        // io.sockets.emit("disconnect");
        // io.sockets.emit("answer");

        // if(clientIp == banIp.ip){
        //         sockets.disconnect(true);
        //         console.log("You banned! : " + banIp.ip);
        //         io.sockets.emit("answer");
        //     }
    });

    socket.on("sendLoginForm", (login, pass) => {
        if(login == "admin" && pass == "qwerty"){
            document.location.href = "index.html";
        }
    });
});