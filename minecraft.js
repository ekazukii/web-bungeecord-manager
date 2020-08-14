var express = require("express");
var path = require("path");
var os = require('os');
const https = require("https");
const EventEmitter = require('events');
const fs = require("fs");
const { SystemChannelFlags } = require("discord.js");
var Server = require('./class/server.js');
var cardsType = require('./class/cardsType.js')
const { forever } = require("request");


// By - https://stackoverflow.com/users/4913447/souhaieb
function isUUID (uuid) {
    if (typeof uuid === "undefined") {
        return false;
    }
    let s = "" + uuid;

    s = s.match('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
    if (s === null) {
      return false;
    }
    return true;
}



function usernameToUUID(username, callback) {
    https.get('https://api.mojang.com/users/profiles/minecraft/' + username, (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        })

        resp.on('end', () => {
            callback(undefined, JSON.parse(data).id);
        });
    });
}

function getUntrimmedUUID(UUID) {
    return UUID.split("-").join("");
}

function getTrimmedUUID(UUID) {
    chars = UUID.split('');
    trimmedUUID = '';
    for (let i = 0; i < chars.length; i++) {
        if(i == 8 || i == 12 || i == 16 || i == 20) {
            trimmedUUID = trimmedUUID + '-'
        }
        trimmedUUID = trimmedUUID + chars[i];
    }
    return trimmedUUID
}

function UUIDToUsername(UUID, callback) {
    https.get('https://api.mojang.com/user/profiles/'+UUID+'/names', (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        })

        resp.on('end', () => {
            callback(undefined, JSON.parse(data).pop().name);
        });
    });
}

function isDef(v) {
    return (typeof v !== "undefined");
}


module.exports = function(options) {
    if(!isDef(options)) {
        console.error("[ERROR] WBM: No options are defined");
        return;
    }

    if(!isDef(options.app) || !isDef(options.whitelist) || !isDef(options.bungee_dir) || !isDef(options.bungee_filename) || !isDef(options.fake_serv) || !isDef(options.wskey) || !isDef(options.servers_json) || !isDef(options.blacklistedCards)) {
        console.error("[ERROR] WBM: at least one params is missing");
        return;
    }

    if(options.whitelist) {
        if(!isDef(options.con)) {
            console.error("[ERROR] WBM: If you want the whitelist you have to provide a MySQL connect instance");
            return;
        }
    }

    var servers = [];
    var app = options.app;
    var con = options.con;
    var socket;
    const io = require('socket.io')(options.server);
    if(options.fake_serv) {
        require("./test/server");
    }
    io.on('connection', (unauthSocket) => {
        console.log("[INFO] NEW SOCKET");
        unauthSocket.on("auth", (data) => {
            console.log("[INFO] AUTHENTIFICATION");
            if (data.key === options.wskey) {
                socket = unauthSocket;
                console.log("[INFO] AUTHENTIFICATION SUCCESSFUL");
            } else {
                console.log("[INFO] AUTHENTIFICATION FAILED");
            }
        })
    });
    var server = options.server;

    var router = express.Router();
    router.use('/img', express.static(path.join(__dirname, 'public/img')));
    router.use('/css', express.static(path.join(__dirname, 'public/css')));
    router.use('/js', express.static(path.join(__dirname, 'public/js')));

    router.use(function (req, res, next) {
        //console.log(req.session)
        if(req.session.rank >= 2) {
            if(typeof socket !== "undefined") {
                next();
            } else {
                console.error("[WARN] CLIENT CONNECT BEFORE SOCKET")
                res.redirect('../404')
            }
        } else {
            res.redirect('../user/login')
        }
    });

    router.get("/", function(req, res) {
        res.sendFile(path.join(__dirname, "views/home.html"));
    })

    router.get("/serveur/", function(req, res) {
        res.sendFile(path.join(__dirname, "views/home.html"));
    });

    router.get("/joueur/", function(req, res) {
        res.sendFile(path.join(__dirname, "views/home.html"));
    });

    router.get("/api/card/:type", function(req, res) {
        if (req.params !== undefined) {
            var cards = []
            cardsType.forEach((card) => {
                if(card.isAllowed(req.session.rank, options, req.params.type)) {
                    cards.push(card.name)
                }
            });

            res.json({cards: cards});
        }
    })

    if(options.whitelist) {
        router.get("/api/whitelist", function(req, res) {
            if(req.session.rank >= 3) {
                socket.emit("request",  {request: "sendWhitelist"});
                socket.on("sendWhitelist", function (data) {
                    res.json({whitelist: data.whitelist});
                    socket.removeAllListeners("sendWhitelist");
                })
            } else {
                res.status(403);
                res.json({error: "forbidden"})
            }
        });

        router.post("/api/whitelist", function(req, res) {
            if(req.session.rank >= 3) {
                if (typeof req.body.whitelist !== "undefined") {
                    if (req.body.whitelist == "true"){
                        socket.emit("request", {request: "startWhitelist"});
                    } else if (req.body.whitelist == "false") {
                        socket.emit("request", {request: "stopWhitelist"});
                    }
                }
                res.json({success: true});
            } else {
                res.status(403);
                res.json({error: "forbidden"})
            }
        })

        router.get("/api/whitelist/uuids", function(req, res) {
            if(req.session.rank >= 3) {
                con.query("SELECT * FROM uuids", (err, resSQL, fields) => {
                    if (err) { console.error(err); }
                    res.json(resSQL);
                });
            } else {
                res.status(403);
                res.json({error: "forbidden"})
            }
        })

        router.post("/api/whitelist/uuids", function(req, res) {
            if(req.session.rank >= 3) {
                if (typeof req.body.username !== "undefined") {
                    usernameToUUID(req.body.username, (err, UUID) => {
                        con.query("INSERT INTO uuids (uuid, username) VALUES ("+con.escape(getTrimmedUUID(UUID))+", "+con.escape(req.body.username)+")", (err, resSQL, fields) => {
                            if (err) {
                              console.error(err);
                              res.json({success: false});
                            } else {
                              res.json({success: true});
                            }
                        });
                    })
                } else {
                    res.json({success: false});
                }
            } else {
                res.status(403);
                res.json({error: "forbidden"})
            }
        })

        router.delete("/api/whitelist/uuids", function(req, res) {
            if(req.session.rank >= 3) {
                if (isUUID(req.body.uuid)) {
                    con.query("DELETE FROM uuids WHERE uuid ="+con.escape(req.body.uuid), (err, resSQL, fields) => {
                      if (err) {
                        console.error(err);
                        res.json({success: false});
                      } else {
                        res.json({success: true});
                      }
                    });
                } else {
                    res.json({success: false});
                }
            } else {
                res.status(403);
                res.json({error: "forbidden"})
            }
        })
    } else {
        app.all("/api/whitelist", function(req, res, next) {
            res.send("Whitelist is not activate");
        });

        app.all("/api/whitelist/uuids", function(req, res, next) {
            res.send("Whitelist is not activate");
        });
    }

    // GET - Get all servers
    router.get("/api/servers", function (req, res) {
        var result = [];
        servers.forEach(server => {
            if(server.name != "bungee") {
                result.push({
                    online: server.online,
                    name: server.name,
                    displayName: server.displayName
                })
            }
        });

        res.json(result);
    });

    router.get("/api/system/cpu", function(req, res) {
        var cpus = os.cpus();
        var usage = []
        for(var i = 0, len = cpus.length; i < len; i++) {
            usage["CPU"+i] = {}
            var cpu = cpus[i], total = 0;

            for(var type in cpu.times) {
                total += cpu.times[type];
            }

            cpuObj = {}
            for(type in cpu.times) {
                cpuObj[type] = Math.round(100 * cpu.times[type] / total)
            }

            usage.push(cpuObj);
        }
        res.json(usage);
    });

    router.get("/api/system/ram", function(req, res) {
        var freememory = os.freemem()
        var usedmemory = os.totalmem() - freememory;
        res.json({freememory: freememory, usedmemory: usedmemory})
    });

    // POST - Send broadcast to all servers / OR stop all servers
    router.post("/api/servers", function(req, res) {
        if (typeof req.body.message !== "undefined") {
            bungeecord.sendCommand("alert &h&4[&cServer&4]&r " + req.body.message);
        } else {
            servers.forEach(server => {
                if(server.online) server.stop();
            });
        }
    });

    // GET - WIP Get informations of the server name
    router.get("/api/servers/:name", function(req, res) {

        const matchName = (server, index) => {
            if(server.name == req.params.name) {
                res.json({
                    version: "ASAP",
                    viaversio: false,
                    whitelist: false,
                    online: server.online
                });
                return true;
            }
        }

        if(!servers.some(matchName)) {
            res.json({success: false});
        }
    });

    // POST - Start / Stop / Whitelist Server name
    router.post("/api/servers/:name", function(req, res) {

        servers.forEach(server => {
           if(server.name == req.params.name) {
               server.toggleStartStop();
           }
        });

        res.json({success: true});
    });

    // GET - Get all players in the server name
    router.get("/api/servers/:name/players", function(req, res) {
        socket.emit("request", {request: "sendPlayers", server: req.params.name});
        socket.on("sendPlayers", (data) => {
            var object = []
            data.players.forEach(player => {
                if (req.params.name === player.server) {
                    object.push({name: player.name, group: "none"})
                }
            });
            res.json(object);
            socket.removeAllListeners("sendPlayers");
        });
    });

    // DELETE - Kick / Ban player of the server name
    router.delete("/api/servers/:name/players", function(req, res) {});

    // POST - Send a command / broadcast to the server name
    router.post("/api/servers/:name/command", function(req, res) {
        if (req.body.command == "true") {
            if(req.session.rank >= 4) {
                servers.forEach(server => {
                    if(server.name == req.params.name) {
                        server.sendCommand(req.body.text);
                    }
                });
                res.json({success: true});
            } else {
                res.status(403);
                res.json({error: "forbidden"})
            }
        } else {
            servers.forEach(server => {
                if(server.name == req.params.name) {
                    server.sendCommand("say " + req.body.text);
                }
            });
            res.json({success: true});
        }
    });

    // GET - GET 20 LAST CONSOLE LINES IF NO LASTLINE INCLUDED, ELSE SEND ALL LINES AFTER THE LAST LINES
    router.get("/api/servers/:name/console", function(req, res) {
        // all : true means we send all 20 lines
        // all : false means we send only lines after req.body.lastline

        if(req.session.rank >= 3) {
            var lines = [
                "Serveur is not launched"
            ]

            for (let i = 0; i < servers.length; i++) {
                const server = servers[i];
                if(server.name == req.params.name) lines = [...server.lines];
            }

            if(typeof req.query.lastline === "undefined") {
                res.json({lines: lines, all: true});
            } else {
                const isContained = (line, index) => {
                    if(line === req.query.lastline) {
                        var result = lines.splice(index+1, 19 - index);
                        res.json({lines: result, all: false});
                        return true;
                    }
                }

                // if lines doesn't include last lines we send all the 20 lines
                if(!lines.some(isContained)) {
                    res.json({lines: lines, all: true});
                }
            }
        } else {
            res.json({success: false});
        }
    })

    // POST - Send all players in the proxy to servers
    router.post("/api/players", function(req, res) {
        if (typeof req.body.server !== "undefined") {
            bungeecord.sendCommand(`send all ${req.body.server}`);
        }
    });

    // GET - Get all players in the proxy
    router.get("/api/players", function(req, res) {
        socket.emit("request", {request: "sendPlayers"});
        socket.on("sendPlayers", (data) => {
            var object = []
            data.players.forEach(player => {
                object.push({name: player.name, server: player.server})
            });
            res.json(object);
            socket.removeAllListeners("sendPlayers");
        });
    });

    // GET - Get information about player in the proxy
    router.get("/api/players/:player", function(req, res) {
        socket.emit("request", {request: "sendPlayer", player: req.params.player});
        socket.on("sendPlayer", (data) => {
            res.json(data);
            socket.removeAllListeners("sendPlayer");
        });
    });

    // POST - Send player to server
    /**
     * TODO: CHANGE WEBSOCKET METHOD
     */
    router.post("/api/players/:player", function(req, res) {
        if(req.session.rank >= 3) {
            if(req.body.sendtoserver == 'true') {
                bungeecord.sendCommand(`send ${ req.params.player} ${req.body.server}`);
            }
            res.json({success: true});
        } else {
            res.status(403);
            res.json({error: "forbidden"})
        }
    });

    // POST - Kick / Ban / Mute player of the proxy
    router.post("/api/players/:player/moderation", function(req, res) {
        if(req.session.rank >= 3) {
            if (req.body.sendtolobby) {
                bungeecord.sendCommand(`send ${req.params.player} lobby`);
            } else if (req.body.banip) {
                bungeecord.sendCommand(`gbanip ${req.params.player}`);
            } else if (req.body.ban) {
                bungeecord.sendCommand(`gban ${req.params.player}`);
            } else if (req.body.mute) {
                bungeecord.sendCommand(`gmute ${req.params.player}`);
            }

            res.json({success: true});
        } else {
            res.status(403);
            res.json({error: "forbidden"})
        }
    });

    // GET - Kick / Ban / Mute player information
    router.get("/api/players/:player/moderation", function(req, res) {
        res.json({ban: false, banip: false, mute: false})
    });

    // GET - Get list permissions of the player
    router.get("/api/players/:player/group", function(req, res) {
        var player = req.params.player;
        socket.emit("request", {request: "sendGroup", player: player});
        socket.on("sendGroup", (data) => {
            res.json(data);
            socket.removeAllListeners("sendGroup");
        });
    });

    // POST - Add permission to players
    router.post("/api/players/:player/group", function(req, res) {
        var player = req.params.player;
        var group = req.body.group;
        if (group === "dev" || group === "builder" || group === "orga") {
            if(req.session.rank >= 4) {
                bungeecord.sendCommand(`lpb user ${player} parent set ${group}`);
                res.json({success: true});
            } else {
                res.status(403);
                res.json({error: "forbidden"})
            }
        } else {
            if(req.session.rank >= 3) {
                bungeecord.sendCommand(`lpb user ${player} parent set ${group}`);
                res.json({success: true});
            } else {
                res.status(403);
                res.json({error: "forbidden"})
            }
        }
    });

    // GET - Get list permissions of the player
    router.get("/api/players/:player/prefix", function(req, res) {
        var player = req.params.player;
        socket.emit("request", {request: "sendPrefix", player: player});
        socket.on("sendPrefix", (data) => {
            res.json(data);
            socket.removeAllListeners("sendPrefix");
        });
    });

    // POST - Add permission to players
    router.post("/api/players/:player/prefix", function(req, res) {
        if(req.session.rank >= 3) {
            var player = req.params.player;
            var prefix = req.body.prefix;
            bungeecord.sendCommand(`lpb user ${player} meta setprefix ${prefix}`);
            res.json({success: true});
        } else {
            res.status(403);
            res.json({error: "forbidden"})
        }
    });

    app.use("/minecraft/", router);

    /**
     * TODO
     * - Launch bungeecord.jar with node.js
     * - Create servers.json to get server location
     * - That's it !
    */

    const serverEvent = new EventEmitter();

    fs.readFile(options.servers_json, (err, data) => {
        if (err) throw err;
        let serversJSON = JSON.parse(data);
        serversJSON.forEach(serverOpt => {
            serverOpt.emitter = serverEvent;
            var server = new Server(serverOpt);
            servers.push(server);
            //server.start();
        });
    });

    var opt = {
        fileType: "java",
        directory: options.bungee_dir,
        fileName: options.bungee_filename,
        opt: "-Djline.terminal=jline.UnsupportedTerminal",
        name: "bungee",
        autoStart: true,
        emitter: serverEvent
    }

    var bungeecord = new Server(opt);
    servers.push(bungeecord)

    process.stdin.on("data", (data) => {
        var words = data.toString().split(":");
        servers.forEach(server => {
            if(server.name == words[0]) {
                words.shift();
                server.sendCommand(words.join(":"));
            }
        });
    })

    serverEvent.on('console-out', (server, message) => {
        console.log(message.replace(/>\s*$/, "").trim());
    });

    serverEvent.on('console-error', (server, message) => {
        console.log(message);
    });

    serverEvent.on('close', (server, message) => {
        console.log(`Server ${server.name} has been stopped`);
    });
}
