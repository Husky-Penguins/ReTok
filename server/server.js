var express = require('express');
var GraphHTTP = require('express-graphql');
var session = require('express-session');
var User = require('./db/db').User;
var Friendship = require('./db/db').Friendship;
var Schema = require('./db/schema');
var app = express();
var http = require('http').Server(app); //Should be https.  Change later after testing
var port = process.env.PORT || 3000;
var Schema = require('./db/schema');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Db = require('./db/db')
var bodyParser = require('body-parser');
var sockets = {};
var cors = require('cors');
require('./auth/auth');
var fs = require('fs');
var https = require('https');
var privateKey  = fs.readFileSync(__dirname + '/key.pem', 'utf8');
var certificate = fs.readFileSync(__dirname + '/cert.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};
var httpsServer = https.createServer(credentials, app);

//Signaling server for MultiRTCConnection Library
var os = require('os');
var io = require('socket.io')(httpsServer);
require('./Signaling-Server.js')(httpsServer, function(socket) {}, io);

app.use(express.static('client'));
app.use(express.static(__dirname + '/../client/'));
app.use(session({secret: 'lets ReTok'}));

app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
var uploadPhoto = ('./db/uploadPhoto');
require('./db/uploadPhoto')(app);
app.use(/\/((?!graphql).)*/, bodyParser.urlencoded({ extended: true }));
app.use(/\/((?!graphql).)*/, bodyParser.json());

app.use('/graphql', GraphHTTP({
  schema: Schema,
  pretty: true,
  graphiql: true
}));

app.get('/auth', function(req, res) {
  var authUser = true;
  if (req.session.passport === undefined) {
    res.send(!authUser);
  } else {
    res.send(authUser);
  }
});

app.post('/login', passport.authenticate('local', {}) ,function(req, res) {
  var userID = req.session.passport.user;
  User.findAll({where:{id: userID}}).then(function(user) {
    var user0 = user[0];
    var resUser = [{
      id: user0.id,
      username: user0.username,
      profilePic: user0.profilePic,
      online: user0.online,
      firstName: user0.firstName,
      lastName: user0.lastName,
      email: user0.email,
      dob: user0.dob,
      coin: user0.coin,
      gender: user0.gender
    }];
    res.status(200).send(resUser);
 });
});

io.sockets.on('connection', function(socket) {

  socket.on('login', function(user) {
    sockets[user] = socket.id; 
    log('this is the room you are in: ', user)
    socket.name = user;
    console.log('ROOM NAME IS', user)
    socket.join(user);
  });

  socket.on('textmessagemount', function() {
    console.log('i hit the textmessagemount.');
  });

  socket.on('textmessagesent', function(message, room) {
    console.log('textmessagesent on server side --->', message, room);
    // socket.broadcast('textmessagereceived', message);
    io.sockets.in(room).emit('textmessagereceived', message);
  });

  socket.on('joinRoom', function(room, oldRoom, username, friend) {
    console.log('joinRoom on server side --->', room);
    // socket.broadcast('textmessagereceived', message);
    if (oldRoom !== username) {
      socket.leave(oldRoom);
      console.log('leaving room', oldRoom);
    }
    socket.join(room);
    console.log('joinRoom on server side now --->', room);
    io.sockets.in(room).emit('joinRoomSuccess', room, friend);
  });

  socket.on('leavetextchatview', function(room, username) {
    console.log('hit leavetextchatview');
    if (room !== username) {
      socket.leave(room);
      console.log('view dismounted. leaving room -->', room);
    }
  });

  socket.on('calling', function(info) {
      var id = sockets[info.user];
      console.log('person calling', info);
      io.sockets.connected[id].emit('invite',info)    
  })
  // convenience function to log server messages on the client
  function log() {
    var array = ['Message from server:'];
    array.push.apply(array, arguments);
    socket.emit('log', array);
  }

  socket.on('connection', function(socket) {
  	log('socket has connected');
  });

  socket.on('message', function(message) {
    log('Client said: ', message);
    // for a real app, would be room-only (not broadcast)
    if(message.room) {
      io.to(message.room).emit('message', message.sessionDescription);  
    }
    socket.broadcast.emit('message', message);
  });

  socket.on('create or join', function(room) {
    log('Received request to create or join room ' + room);

    var numClients = Object.keys(io.sockets.adapter.rooms[room]).length;
    log('Room ' + room + ' now has ' + numClients + ' client(s)');
    //socket.emit('created', room, socket.id);
    if (numClients === 2 && sockets[room] !== socket.id) {
      log('Client ID ' + socket.id + ' created room ' + room);
      socket.join(room);
      io.sockets.in(room).emit('join', room);
      io.sockets.in(room).emit('ready');
    } else { // max two clients
      socket.emit('full', room);
    }
  });

  socket.on('ipaddr', function() {
    var ifaces = os.networkInterfaces();
    for (var dev in ifaces) {
      ifaces[dev].forEach(function(details) {
        if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
          socket.emit('ipaddr', details.address);
        } 
      });
    }
  });

  //Socket for updating profile with online/offline and new friends
  socket.on('updateFriends', function(friends) {
    friends.forEach(function(friend) {
      var id = sockets[friend.username]
      if(sockets[friend.username]) {
        console.log('updating everyone')
        io.sockets.connected[id].emit('update')    
      }
    })
  })

  socket.on('disconnect', function() {
    console.log('socket disconnected')
    User.update({online: false}, {where: {username: socket.name}});
    var myself = null;
    var friends = [];
    Db.User.findAll({where: {username: socket.name}})
      .then(function(user){
        if(!!user && !!user[0]) {
          myself = user;
          return Db.sequelize.query("SELECT `FriendTwo`.`id` , `FriendTwo`.`username`, `FriendTwo`.`firstName`, `FriendTwo`.`lastName`, `FriendTwo`.`email`, `FriendTwo`.`dob`, `FriendTwo`.`gender`, `FriendTwo`.`profilePic`, `FriendTwo`.`coin`, `FriendTwo`.`online`, `FriendTwo`.`createdAt`, `FriendTwo`.`updatedAt`, `FriendTwo.Friendship`.`relationship`, `FriendTwo.Friendship`.`textChatCount`, `FriendTwo.Friendship`.`videoChatCount`, `FriendTwo.Friendship`.`lastChatTime`, `FriendTwo.Friendship`.`createdAt`, `FriendTwo.Friendship`.`updatedAt`, `FriendTwo.Friendship`.`userOne`, `FriendTwo.Friendship`.`userTwo` FROM `Users` AS `User` LEFT OUTER JOIN (`Friendships` AS `FriendTwo.Friendship` INNER JOIN `Users` AS `FriendTwo` ON `FriendTwo`.`id` = `FriendTwo.Friendship`.`userTwo`) ON `User`.`id` = `FriendTwo.Friendship`.`userOne` WHERE `FriendTwo.Friendship`.`userOne` ="+user[0].id+";");
        }
      })
      .then((response) => {
        if(!!response && response !== undefined ) {
          response[0].forEach(function(friend){
            friends.push(friend); 
          });
        }
      })
      .then(function(nothing){
	if(!!myself) {
        return Db.sequelize.query("SELECT `FriendOne`.`id` , `FriendOne`.`username`, `FriendOne`.`firstName`, `FriendOne`.`lastName`, `FriendOne`.`email`, `FriendOne`.`dob`, `FriendOne`.`gender`, `FriendOne`.`profilePic`, `FriendOne`.`coin`, `FriendOne`.`online`, `FriendOne`.`createdAt`, `FriendOne`.`updatedAt`, `FriendOne.Friendship`.`relationship`, `FriendOne.Friendship`.`textChatCount`, `FriendOne.Friendship`.`videoChatCount`, `FriendOne.Friendship`.`lastChatTime`, `FriendOne.Friendship`.`createdAt`, `FriendOne.Friendship`.`updatedAt`, `FriendOne.Friendship`.`userOne`, `FriendOne.Friendship`.`userTwo` FROM `Users` AS `User` LEFT OUTER JOIN (`Friendships` AS `FriendOne.Friendship` INNER JOIN `Users` AS `FriendOne` ON `FriendOne`.`id` = `FriendOne.Friendship`.`userOne`) ON `User`.`id` = `FriendOne.Friendship`.`userTwo` WHERE `FriendOne.Friendship`.`userTwo` ="+myself[0].id+";");
     	}
      })
      .then(function(response){ 
        sockets[socket.name] = null;
        if(!!response && response !== undefined )  {
          response[0].forEach(function(friend){
            friends.push(friend);
          });
        }
        friends.forEach(function(friend) {
          var id = sockets[friend.username]
          if(id !== null && id !== undefined) {
            console.log('updating', friend.username);
            io.sockets.connected[id].emit('update')    
          }
        })
      })
  }) 

  socket.on('endTextChat', function(username, coin){
    Db.User.update({coin: coin}, {where: {username: username}});
  });

});

app.get('/logout', function (req, res){
  req.session.destroy();
	req.logout();
  res.status(200).send('');
});

app.get('*', function(req, res) {
  res.redirect('/');
})


http.listen(port, function(data) {
  console.log('listening on ' + port);

});

httpsServer.listen(8443);
