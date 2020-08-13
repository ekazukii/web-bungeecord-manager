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
            this.setTitle("Actions rapides");
            var self = this;
            var player = this.param;
            this.clearCard();
            var i = 1;
            $('.' + this.id).find(".table-container").append(
                '<div class="scripts">'
               +'  <div class="form-container">'
               +'    <form class="form-broadcast form container">'
               +'      <div class="form-row"><label for="broadcast-input" class="col">Envoyer un broadcast</label></div>'
               +'      <div class="form-row">'
               +'        <input type="text" class="form-control col-md-9" id="broadcast-input" placeholder="Entrez votre message ici">'
               +'        <div class="col-md-3"><button class="btn btn-primary mb-6 form-confirm" onclick="return false;" id="broadcast-confirm">Envoyer</button></div>'
               +'      </div>'
               +'    </form>'
               +'    <small id="emailHelp" class="form-text text-muted">Le broadcast sera envoyé tout les serveurs en ligne</small>'
               +'  </div>'
               +'  <div class="form-container">'
               +'    <form class="form-broadcast form container">'
               +'      <div class="form-row"><label for="players-send-server-input" class="col">Envoyer tout les joueurs sur un serveur</label></div>'
               +'      <div class="form-row">'
               +'            <select class="form-control col-md-9" id="players-send-server-input">'
               +'             </select>'
               +'        <div class="col-md-3"><button class="btn btn-primary mb-6 form-confirm" onclick="return false;" id="players-send-server">Envoyer</button></div>'
               +'      </div>'
               +'    </form>'
               +'    <small id="emailHelp" class="form-text text-muted">Les joueurs avec des permissions administrateur ne seront pas affectée</small>'
               +'  </div>'
               +'  <div class="form-container" id="stop-servers-div">'
               +'    <form class="form-broadcast form container form-inline">'
               +'      <div class="form-group"><label for="stop-servers-input" class="col" id="stop-servers-label">Eteindre tout les serveurs en ligne</label></div>'
               +'      <div class="form-group">'
               +'        <div class=""><button class="btn btn-danger mb-6 form-confirm" onclick="return false;" id="stop-servers-input">Envoyer</button></div>'
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
