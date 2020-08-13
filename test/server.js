var socket = require('socket.io-client')('http://localhost:8080');

var players = [
    {name: "ekazuki", server: "lobby", group: "dev", prefix: "[Admin]"}, 
    {name: "zefut", server: "murder", group: "builder", prefix: "[Test]"}, 
    {name: "bot1", server: "lobby", group: "default", prefix: ""},
    {name: "Hollfrost", server: "build", group: "frerot", prefix: ""},
    {name: "Logorrheique", server: "build", group: "orga", prefix: ""}
];

var servers = [
    {name: "lobby", displayName: "Lobby", online: true},
    {name: "murder", displayName: "Murder", online: true},
    {name: "build", displayName: "Build", online: true},
    {name: "lg", displayName: "Loup-garou", online: false}
];

var whitelist = false;

socket.on('connect', function(){
    console.log("CLIENT CONNECT");
    socket.emit("auth", {key: process.env.WSKEY})
});

socket.on('request', function(data){
    console.log(data.request)
    switch (data.request) {
        case "sendPlayers":
            sendPlayers(data);
            break;
        case "sendPlayer":
            sendPlayer(data);
            break;
        case "sendServers":
            sendServers(data);
            break;
        case "sendServer":
            sendServer(data);
            break;
        case "kickPlayer":
            kickPlayer(data);
            break;
        case "sendPlayerToServer":
            sendPlayerToServer(data);
            break;
        case "sendAllPlayersToServer":
            sendAllPlayersToServer(data);
            break;
        case "startServer":
            startServer(data);
            break;
        case "stopServer":
            stopServer(data);
            break;
        case "stopAllServers":
            stopAllServers(data);
            break;
        case "sendCommand":
            sendCommand(data);
            break;
        case "sendWhitelist":
            sendWhitelist(data);
            break;
        case "startWhitelist":
            whitelist = true;
            break;
        case "stopWhitelist":
            whitelist = false;
            break;
        case "broadcast":
            console.log("BROADCAST : " + data.message);
            break;
        case "sendPrefix":
            sendPrefix(data);
            break;
        case "sendGroup":
            sendGroup(data);
            break;
        case "setPrefix":
            setPrefix(data);
            break;
        case "setGroup":
            setGroup(data);
            break;
        case "banPlayer":
            banPlayer(data);
            break;
        case "banipPlayer":
            banipPlayer(data);
            break;
        case "mutePlayer":
            mutePlayer(data);
            break;
    }
})

function sendPlayers(data){
    var res = [];
    players.forEach(player => {
        res.push({name: player.name, server: player.server});
    });
    socket.emit("sendPlayers", {players: res});
};

function sendPlayer(data) {
    players.forEach(player => {
        if (player.name == data.player) {
            socket.emit("sendPlayer", {server: player.server});
        }
    });

}

function sendServers(data) {
    var res = {request: "sendServers", servers: []};
    servers.forEach(server => {
        res.servers.push({name: server.name, displayName: server.displayName, online: server.online});
    });
    socket.emit("sendServers", res);
};

function sendServer(data){
    var res;
    servers.forEach(server => {
        if (server.name === data.server) {
            res = {name: server.name, displayName: server.displayName, online: server.online, players: []};
            players.forEach(player => {
                if (player.server === data.server) {
                    res.players.push({name: player.name, group: "none"});
                }
            });
        }
    });
    socket.emit("sendServer", res);
};

function sendCommand(data){
    console.log(data);
};

function kickPlayer(data){
    for (let i = 0; i < players.length; i++) {
        if (players[i].name === data.player) {
            players.splice(i,1);
        }
    }
};

function sendPlayerToServer(data){
    for (let i = 0; i < players.length; i++) {
        if (players[i].name === data.player) {
            console.log("send : " + players[i].name + " to "+data.server);
            players[i].server = data.server;
        }
    }
};

function sendAllPlayersToServer(data){
    for (let i = 0; i < players.length; i++) {
        players[i].server = data.server;
    }
};

function startServer(data) {
    servers.forEach(server => {
        if(server.name === data.server) {
            server.online = true;
        }
    });
}

function stopServer(data) {
    servers.forEach(server => {
        if(server.name === data.server) {
            server.online = false;
        }
    });
}

function stopAllServers(data) {
    servers.forEach(server => {
        server.online = false;
    })
}

function sendWhitelist(data) {
    socket.emit("sendWhitelist", {whitelist: whitelist});
}

function sendGroup(data) {
    players.forEach((player) => {
        if (player.name === data.player) {
            socket.emit("sendGroup", {group: player.group});
        }
    })
}

function sendPrefix(data) {
    players.forEach((player) => {
        if (player.name === data.player) {
            socket.emit("sendPrefix", {prefix: player.prefix})
        }
    })
}

function setGroup(data) {
    players.forEach((player) => {
        if (player.name === data.player) {
            player.group = data.group;
        }
    })
}


function setPrefix(data) {
    players.forEach((player) => {
        if (player.name === data.player) {
            player.prefix = data.prefix;
        }
    })
}

function banipPlayer(data) {
    for (let i = 0; i < players.length; i++) {
        if (players[i].name === data.player) {
            players.splice(i,1);
        }
    }
}

function banPlayer(data) {
    for (let i = 0; i < players.length; i++) {
        if (players[i].name === data.player) {
            players.splice(i,1);
        }
    }
}

function mutePlayer(data) {
    console.log("[INFO] "+data.player + " is now muted for 12 hours");
}


