define([
    'src/card/Card',
], function(Card){
    return class ScriptsCard extends Card {

        constructor(cardNumber, options) {
            super(cardNumber, options);
            this.param = options.param;
            this.refreshCards = options.refresh;
            //$('.' + this.id).find("table").remove();
        }

        setData(data) {
                        this.clearCard();
            if(this.lang === "fr") {
                this.setTitle("Actions rapides");
                this.language.sendBroadcast = "Envoyer un broadcast";
                this.language.broadcastPlaceholder = "Entrez votre message ici";
                this.language.broadcastTooltip = "Le broadcast sera envoyé tout les serveurs en ligne";
                this.language.sendAll = "Envoyer tout les joueurs sur un serveur";
                this.language.sendAllTooltip = "Les joueurs avec des permissions administrateur ne seront pas affectée";
                this.language.stopAll = "Eteindre tout les serveurs en ligne";
            } else {
                this.setTitle("Quick actions");
                this.language.sendBroadcast ="Send broadcast";
                this.language.broadcastPlaceholder = "Type your broadcast here";
                this.language.broadcastTooltip = "This broadcast will be sended to all servers";
                this.language.sendAll = "Send all players in one server";
                this.language.sendAllTooltip = "Players with admin perms will not be affected";
                this.language.stopAll = "Stop all online servers";
            }

            var self = this;
            var player = this.param;
            var i = 1;
            $('.' + this.id).find(".table-container").append(
                '<div class="scripts">'
               +'  <div class="form-container">'
               +'    <form class="form-broadcast form container">'
               +'      <div class="form-row"><label for="broadcast-input" class="col">'+self.language.sendBroadcast+'</label></div>'
               +'      <div class="form-row">'
               +'        <input type="text" class="form-control col-md-9" id="broadcast-input" placeholder="'+self.language.broadcastPlaceholder+'">'
               +'        <div class="col-md-3"><button class="btn btn-primary mb-6 form-confirm" onclick="return false;" id="broadcast-confirm">'+self.language.submit+'</button></div>'
               +'      </div>'
               +'    </form>'
               +'    <small id="emailHelp" class="form-text text-muted">'+self.language.broadcastTooltip+'</small>'
               +'  </div>'
               +'  <div class="form-container">'
               +'    <form class="form-broadcast form container">'
               +'      <div class="form-row"><label for="players-send-server-input" class="col">'+self.language.sendAll+'</label></div>'
               +'      <div class="form-row">'
               +'            <select class="form-control col-md-9" id="players-send-server-input">'
               +'             </select>'
               +'        <div class="col-md-3"><button class="btn btn-primary mb-6 form-confirm" onclick="return false;" id="players-send-server">'+self.language.submit+'</button></div>'
               +'      </div>'
               +'    </form>'
               +'    <small id="emailHelp" class="form-text text-muted">'+self.language.sendAllTooltip+'</small>'
               +'  </div>'
               +'  <div class="form-container" id="stop-servers-div">'
               +'    <form class="form-broadcast form container form-inline">'
               +'      <div class="form-group"><label for="stop-servers-input" class="col" id="stop-servers-label">'+self.language.stopAll+'</label></div>'
               +'      <div class="form-group">'
               +'        <div class=""><button class="btn btn-danger mb-6 form-confirm" onclick="return false;" id="stop-servers-input">'+self.language.submit+'</button></div>'
               +'      </div>'
               +'    </form>'
               +'  </div>'
               +'</div>'
            );


            data.forEach(server => {
                if (server.online) {
                    $("#players-send-server-input").append('<option value="'+server.name+'">'+server.displayName+'</option>')
                }
            });

            $("#broadcast-confirm").click(function() {
                var val = $("#broadcast-input").val();
                $.post('/minecraft/api/servers', {message: val});
                $("#broadcast-input").val("");
            });

            $("#players-send-server").click(function() {
                var val = $("#players-send-server-input").val();
                self.startLoading();
                $.post('/minecraft/api/players', {server: val});
                setTimeout(function() {
                    self.refresh();
                    self.refreshCards("players");
                }, 200)
            });

            $("#stop-servers-input").click(function() {
                self.startLoading();
                $.post('/minecraft/api/servers', {});
                setTimeout(function() {
                    self.refresh();
                    self.refreshCards("servers");
                }, 5000)
            })
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
