define([
    'src/card/Card',
], function(Card){
    return class ActionsCard extends Card {

        constructor(cardNumber, options) {
            super(cardNumber, options);
            this.param = options.param;
            this.refreshCards = options.refresh;
            //$('.' + this.id).find("table").remove();
        }

        setData(data) {
            var self = this;
            var player = this.param;
            this.clearCard();
            if(this.lang == "fr") {
                this.setTitle("Actions rapides sur "+player);
                this.language.makePlayerExec = "Faire éxécuter une commande par le joueur";
                this.language.makePlayerExecPlaceholder = "Entrez ici votre commande, sans le slash";
                this.language.makePlayerExecTooltip = "Cette commande sera éxécuté par le joueur";
                this.language.sendMessage = "Envoyer un message au joueur";
                this.language.sendMessagePlaceholder = "Entrez votre message ici";
                this.language.sendMessageTooltip = "Seul ce joueur recevra le message";
                this.language.sendPlayer = "Envoyer le joueur sur un serveur";
            } else {
                this.setTitle("Quick actions on "+player);                
                this.language.makePlayerExec = "Make the player execute a command";
                this.language.makePlayerExecPlaceholder = "Type your command here without the slash";
                this.language.makePlayerExecTooltip = "This command will be execute by the player";
                this.language.sendMessage = "Send a message to the player";
                this.language.sendMessagePlaceholder = "Type your message here";
                this.language.sendMessageTooltip = "Only this player will receive the message";
                this.language.sendPlayer = "Send this player to specified server";
            }

            var i = 1;
            $('.' + this.id).find(".table-container").append(
                '<div class="player-action">'
               +'  <div class="form-container">'
               +'    <form class="form-broadcast form container">'
               +'      <div class="form-row"><label for="player-command-input" class="col">'+self.language.makePlayerExec+'</label></div>'
               +'      <div class="form-row">'
               +'        <input type="text" class="form-control col-md-9" id="player-command-input" placeholder="'+self.language.makePlayerExecTooltip+'">'
               +'        <div class="col-md-3"><button class="btn btn-danger mb-2 form-confirm" onclick="return false;" id="player-command">'+self.language.submit+'</button></div>'
               +'      </div>'
               +'    </form>'
               +'    <small id="emailHelp" class="form-text text-muted">'+self.language.makePlayerExecTooltip+'</small>'
               +'  </div>'
               +'  <div class="form-container">'
               +'    <form class="form-broadcast form container">'
               +'      <div class="form-row"><label for="player-message-input" class="col">'+self.language.sendMessage+'</label></div>'
               +'      <div class="form-row">'
               +'        <input type="text" class="form-control col-md-9" id="player-message-input" placeholder="'+self.language.sendMessagePlaceholder+'">'
               +'        <div class="col-md-3"><button class="btn btn-primary mb-6 form-confirm" onclick="return false;" id="player-message">'+self.language.submit+'</button></div>'
               +'      </div>'
               +'    </form>'
               +'    <small id="emailHelp" class="form-text text-muted">'+self.language.sendMessageTooltip+'</small>'
               +'  </div>'
               +'  <div class="form-container">'
               +'    <form class="form-broadcast form container">'
               +'      <div class="form-row"><label for="player-send-server-input" class="col">'+self.language.sendPlayer+'</label></div>'
               +'      <div class="form-row">'
               +'            <select class="form-control col-md-9" id="player-send-server-input">'
               +'             </select>'
               +'        <div class="col-md-3"><button class="btn btn-primary mb-6 form-confirm" onclick="return false;" id="player-send-server">'+self.language.submit+'</button></div>'
               +'      </div>'
               +'    </form>'
               +'  </div>'
               +'</div>'
            );

            data.forEach(server => {
                if (server.online) {
                    $("#player-send-server-input").append('<option value="'+server.name+'">'+server.displayName+'</option>')
                }
            });

            $("#player-command").click(function() {
                var val = $("#player-command-input").val();
                $.post('/minecraft/api/players/'+player, {text: val, command: true, sendtoserver: false});
                $("#player-command-input").val("");
            });

            $("#player-message").click(function() {
                var val = $("#player-message-input").val();
                $.post('/minecraft/api/players/'+player, {text: val, command: false, sendtoserver: false});
                $("#player-message-input").val("");
            });

            $("#player-send-server").click(function() {
                var val = $("#player-send-server-input").val();
                self.startLoading();
                $.post('/minecraft/api/players/'+player, {server: val, sendtoserver: true});
                $("player-send-server").val("");
                self.refreshCards("players")
                self.refresh();
            });
        }

        refresh() {
            this.startLoading();
            var self = this;
            $.ajax({
                url : '/minecraft/api/servers', // La ressource ciblée
                type : 'GET' // Le type de la requête HTTP.
            }).done(function(data) {
                self.setData(data)
            });
        }

        getData(data) {

        }
    }
});
