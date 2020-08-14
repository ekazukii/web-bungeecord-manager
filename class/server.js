const { spawn } = require("child_process");

module.exports = class Server {
    constructor(options) {
        if(typeof options.directory != "string" || typeof options.fileName != "string") {
            throw new Error("No directory or file specified");
        }

        this.directory = options.directory;
        this.fileName = options.fileName;

        this.name = options.name;
        this.fileType = options.fileType;
        this.emitter = options.emitter;

        this.displayName = options.displayName;

        this.options = options.opt || "-Xmx1G";
        this.online = false;

        this.lines = []

        if(options.autoStart) this.start();
    }

    start() {
        // When event is received throw another nodejs event with for parameters this (server instance) and the message
        // Cleaner way than a callback
        if(this.fileType == "java") {
            this.processus = spawn(this.fileType, [this.options, "-jar", this.directory + this.fileName, " --nogui"], {cwd: this.directory});
        } else {
            this.processus = spawn(this.fileType, [this.directory + this.fileName], {cwd: this.directory});
        }
        this.online = true;

        this.processus.stdout.on('data', (data) => {
            var message = data.toString().replace(/\n+$/, "");
            this.emitter.emit('console-out', this, message);
            this.addLine(message);
        });

        this.processus.stderr.on('data', (data) => {
            this.emitter.emit('console-error', this, data.toString().replace(/\n+$/, ""));
        });

        this.processus.on("close", (code) => {
            this.online = false;
            this.emitter.emit('close', this, code.toString().replace(/\n+$/, ""));
        });
    }

    stop() {
        this.online = false;
        this.sendCommand("stop");
        this.lines = ["Le serveur n'est pas lancé"];
    }

    toggleStartStop() {
        this.online ? this.stop() : this.start();
    }

    sendCommand(command) {
        this.processus.stdin.write(command+"\n");
    }

    addLine(line) {
        if(this.lines.length >= 20) {
            this.lines.shift();
        }

        this.lines.push(line);
    }


}
