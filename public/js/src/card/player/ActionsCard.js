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
            this.setTitle("Actions rapides sur "+player);
            var i = 1;
            $('.' + this.id).find(".table-container").append(
                '<div class="player-action">'
               +'  <div class="form-container">'
               +'    <form class="form-broadcast form container">'
               +'      <div class="form-row"><label for="player-command-input" class="col">Faire éxécuter une commande par le joueur</label></div>'
               +'      <div class="form-row">'
               +'        <input type="text" class="form-control col-md-9" id="player-command-input" placeholder="Entrez ici votre commande, sans le slash">'
               +'        <div class="col-md-3"><button class="btn btn-danger mb-2 form-confirm" onclick="return false;" id="player-command">Envoyer</button></div>'
               +'      </div>'
               +'    </form>'
               +'    <small id="emailHelp" class="form-text text-muted">Cette commande sera éxécuté par la console</small>'
               +'  </div>'
               +'  <div class="form-container">'
               +'    <form class="form-broadcast form container">'
               +'      <div class="form-row"><label for="player-message-input" class="col">Envoyer un message au joueur</label></div>'
               +'      <div class="form-row">'
               +'        <input type="text" class="form-control col-md-9" id="player-message-input" placeholder="Entrez votre message ici">'
               +'        <div class="col-md-3"><button class="btn btn-primary mb-6 form-confirm" onclick="return false;" id="player-message">Envoyer</button></div>'
               +'      </div>'
               +'    </form>'
               +'    <small id="emailHelp" class="form-text text-muted">Le broadcast sera seulement envoyer sur ce serveur</small>'
               +'  </div>'
               +'  <div class="form-container">'
               +'    <form class="form-broadcast form container">'
               +'      <div class="form-row"><label for="player-send-server-input" class="col">Envoyer le joueur sur un serveur</label></div>'
               +'      <div class="form-row">'
               +'            <select class="form-control col-md-9" id="player-send-server-input">'
               +'             </select>'
               +'        <div class="col-md-3"><button class="btn btn-primary mb-6 form-confirm" onclick="return false;" id="player-send-server">Envoyer</button></div>'
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
