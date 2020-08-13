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
            var server = this.param;
            this.setTitle("Actions sur le serveur "+server);
            this.clearCard();
            var i = 1;
            $('.' + this.id).find(".table-container").append(
                '<div class="send-to-server">'
               +'  <div class="form-container">'
               +'    <form class="form-broadcast form container margin-top-30">'
               +'      <div class="form-row"><label for="server-command-input" class="col">Exécuter une commande par le serveur</label></div>'
               +'      <div class="form-row">'
               +'        <input type="text" class="form-control col-md-9" placeholder="Entrez ici votre commande, sans le slash" id="server-command-input">'
               +'        <div class="col-md-3"><button class="btn btn-danger mb-2 form-confirm" id="server-command" onclick="return false;">Envoyer</button></div>'
               +'      </div>'
               +'    </form>'
               +'    <small id="emailHelp" class="form-text text-muted">Cette commande sera éxécuté par la console</small>'
               +'  </div>'
               +'  <div class="form-container">'
               +'    <form class="form-broadcast form container margin-top-30">'
               +'      <div class="form-row"><label for="server-broadcast-input" class="col">Envoyer un message sur le serveur</label></div>'
               +'      <div class="form-row">'
               +'        <input type="text" class="form-control col-md-9" placeholder="Entrez votre message ici" id="server-broadcast-input">'
               +'        <div class="col-md-3"><button class="btn btn-primary mb-6 form-confirm" id="server-broadcast" onclick="return false;">Envoyer</button></div>'
               +'      </div>'
               +'    </form>'
               +'    <small id="emailHelp" class="form-text text-muted">Le broadcast sera seulement envoyé sur ce serveur</small>'
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
