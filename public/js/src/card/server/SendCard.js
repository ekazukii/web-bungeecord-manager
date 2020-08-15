define([
    'src/card/Card',
], function(Card){
    return class SendCard extends Card {

        constructor(cardNumber, options) {
            super(cardNumber, options);
            this.param = options.param;
            //$('.' + this.id).find("table").remove();
        }

        setData() {
            var self = this;
            var server = this.param;
            this.clearCard();
            if(this.lang === "fr") {
                this.setTitle("Actions sur le serveur "+server);
                this.language.makeServerExec = "Exécuter une commande par le serveur";
                this.language.makeServerExecPlaceholder = "Entrez ici votre commande, sans le slash";
                this.language.makeServerExecTooltip = "Cette commande sera éxécuté par la console";
                this.language.broadcastToServer = "Envoyer un message sur le serveur";
                this.language.broadcastToServerPlaceholder = "Entrez ici le broadcast";
                this.language.broadcastToServerTooltip = "Le broadcast sera seulement envoyé sur ce serveur";
            } else {
                this.setTitle("Action on the server "+server);
                this.language.makeServerExec = "Make the server execute a command";
                this.language.makeServerExecPlaceholder = "Type your command here without the slash";
                this.language.makeServerExecTooltip = "This command will be execute by the server";
                this.language.broadcastToServer = "Send a message to the server";
                this.language.broadcastToServerPlaceholder = "Type the broadcast here";
                this.language.broadcastToServerTooltip = "The broadcast will be sended only on this server";
            }

            var i = 1;
            $('.' + this.id).find(".table-container").append(
                '<div class="send-to-server">'
               +'  <div class="form-container">'
               +'    <form class="form-broadcast form container margin-top-30">'
               +'      <div class="form-row"><label for="server-command-input" class="col">'+self.language.makeServerExec+'</label></div>'
               +'      <div class="form-row">'
               +'        <input type="text" class="form-control col-md-9" placeholder="'+self.language.makeServerExecPlaceholder+'" id="server-command-input">'
               +'        <div class="col-md-3"><button class="btn btn-danger mb-2 form-confirm" id="server-command" onclick="return false;">'+self.language.submit+'</button></div>'
               +'      </div>'
               +'    </form>'
               +'    <small id="emailHelp" class="form-text text-muted">'+self.language.makeServerExecTooltip+'</small>'
               +'  </div>'
               +'  <div class="form-container">'
               +'    <form class="form-broadcast form container margin-top-30">'
               +'      <div class="form-row"><label for="server-broadcast-input" class="col">'+self.language.broadcastToServer+'</label></div>'
               +'      <div class="form-row">'
               +'        <input type="text" class="form-control col-md-9" placeholder="'+self.language.broadcastToServerPlaceholder+'" id="server-broadcast-input">'
               +'        <div class="col-md-3"><button class="btn btn-primary mb-6 form-confirm" id="server-broadcast" onclick="return false;">'+self.language.submit+'</button></div>'
               +'      </div>'
               +'    </form>'
               +'    <small id="emailHelp" class="form-text text-muted">'+self.language.broadcastToServerTooltip+'</small>'
               +'  </div>'
               +'</div>'
            );

            $("#server-command").click(function() {
                var val = $("#server-command-input").val();
                $.post('/minecraft/api/servers/'+server+'/command', {text: val, command: true});
                $("#server-command-input").val("");
            });

            $("#server-broadcast").click(function() {
                var val = $("#server-broadcast-input").val();
                $.post('/minecraft/api/servers/'+server+'/command', {text: val, command: false});
                $("#server-broadcast-input").val("");
            });
        }

        refresh() {
            this.setData();
        }

        getData(data) {

        }
    }
});
