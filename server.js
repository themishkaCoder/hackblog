const express = require("express");
//const mongoose = require("mongoose");
//const keys = require("./keys");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require('mongodb').ObjectID
var db;
const app = express();
const server = require("http").createServer(app);

const io = require("socket.io").listen(server);

var port = process.env.PORT || 3000;

// MongoClient.connect('mongodb+srv://admin:14stsahara@cluster0-qenr5.mongodb.net/messages?retryWrites=true', function (err, database) {
//   if (err) {
//     return console.log(err);
//   }
//   db = database.db('mess');
//   server.listen(port, function () {
//     console.log('API app started');
//   })
// })

//server.listen(port);


server.listen(3000, "192.168.88.200");


// mongoose.connect(keys.mongoURI)
//     .then(() => console.log("MongoDB connected."))
//     .catch(err => console.error(err))

app.use(express.static('public'));


////////////////// Mongo start

// app.post('/mess', function (req, res) {
//     var messList = {
//       name: req.body.name
//     };
  
//     db.collection('mess').insert(messList, (err, result) => {
//       if (err) {
//         console.log(err);
//         return res.sendStatus(500);
//       }
//       res.send(messList);
//     })
//   })

//   app.get('/mess', function (req, res) {
//     db.collection('mess').find().toArray(function (err, docs) {
//       if (err) {
//         console.log(err);
//         return res.sendStatus(500);
//       }
//       res.send(docs);
//     })
//   })




////////////////// Mongo end






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
var banList = [];

io.sockets.on("connection", (socket) => {
    var clientIp = socket.request.connection.remoteAddress;
    var clientId = socket.id;
    console.log("Новый пользователь подключен " + clientIp + " : " + clientId);
    
    //console.log(socket.id);
    //connections.push(clientIp);
    connections.push(clientIp);
    console.log(connections);
    console.log("banned users: " + banList);
    // if(clientIp == "192.168.88.31"){
    //     socket.disconnect(true);
    //     console.log("You banned! " + clientIp);
    // }
    for(var banCheck of banList){
        if(banCheck == clientIp){
            socket.disconnect(true);
        }
    }
    for(var connectIp of connections){
        console.log(connectIp);
        io.sockets.emit("newUser", connectIp);
    }
    

    socket.on("disconnect", (data) => {
        connections.splice(connections.indexOf(socket), 1);
        console.log("Пользователь отключен " + clientIp);
        console.log(connections);
        
        io.sockets.emit("removeUser", clientIp);
        
    })

    socket.on("sendMess", (data, name) => {
        io.sockets.emit("addMess", {msg: data, user: name});
        console.log(clientId + " # " + clientIp +" : " + name + ": " + data);
    });

    socket.on("printEvent", () => {
        io.sockets.emit("printingSuccess");
        
    });

    socket.on("banUser", (data) => {
        var banIp = {
            ip: data
        };
        for(var itemIp of connections){
            if(itemIp == banIp.ip){
                //socket.disconnect(true);
                io.sockets.emit("answer");
                socket.disconnect(true).to(banIp.ip);
                connections.splice(connections.indexOf(banIp.ip), 1);
                
                banList.push(banIp.ip);
                console.log("You banned! : " + banIp.ip + "\n\n" + "banned users: " + banList);
                //console.log(connections);
                
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