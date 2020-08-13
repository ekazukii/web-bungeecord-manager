define([
    'src/card/Card',
], function(Card){ 
    return class ModerationCard extends Card {

        constructor(cardNumber, options) {
            super(cardNumber, options);
            this.param = options.param;
            this.refreshCards = options.refresh;
        }
        
        setData(data) {
            var self = this;
            var player = this.param;
            this.clearCard();
            this.setTitle("Modération du joueur");
            var ban, banip, mute;

            if (data.ban) {
                ban = 'Le joueur est ban <button class="btn btn-primary mb-2 form-confirm" id="ban-button">Déban</button>'
            } else {
                ban = 'Le joueur n\'est pas ban <button class="btn btn-danger mb-2 form-confirm" id="ban-button">Bannir 12h</button>'
            }

            if (data.mute) {
                mute = 'Le joueur est mute - <button class="btn btn-primary mb-2 form-confirm" id="mute-button">Démute</button>'
            } else {
                mute = 'Le joueur n\'est pas mute - <button class="btn btn-danger mb-2 form-confirm" id="mute-button">Muter le joueur</button>'
            }

            if (data.banip) {
                banip = 'Le joueur est ban-ip <button class="btn btn-primary mb-2 form-warning" id="banip-button">Unban l\'ip</button>'
            } else {
                banip = 'Le joueur n\'est pas ban-ip <button class="btn btn-danger mb-2 form-confirm" id="banip-button">Bannir l\'ip 12h</button>'
            }

            $('.' + this.id).find(".table-container").append(
                '<div class="server-info">'
               +'  <ul class="text-left list-unstyled">'
               +'    <li class="first">'+mute+'</li>'           
               +'    <li>Le joueur est sur le serveur '+data.server+' <button class="btn btn-warning mb-2 form-confirm" id="send-lobby">Envoyer au lobby</button></li>'        
               +'    <li>'+ban+'</li>'
               +'    <li>'+banip+'</li>'
               +'  </ul>'
               +'</div>'
            );

            $("#ban-button").click(function() {
                self.startLoading();
                $.post('/minecraft/api/players/'+player+'/moderation', {ban: ($("#ban-button").text() === "Bannir 12h")})
                self.refreshCards("players")
            });

            $("#mute-button").click(function() {
                self.startLoading();
                $.post('/minecraft/api/players/'+player+'/moderation', {mute: ($("#mute-button").text() === "Muter le joueur")})
                self.refreshCards("players")
            });

            $("#banip-button").click(function() {
                self.startLoading();
                $.post('/minecraft/api/players/'+player+'/moderation', {banip: ($("#banip-button").text() === "Bannir l\'ip 12h")})
                self.refreshCards("players")
            });

            $("#send-lobby").click(function() {
                self.startLoading();
                $.post('/minecraft/api/players/'+player+'/moderation', {sendtolobby: true});
                self.refreshCards("players")
            })
        }

        refresh() {
            this.startLoading();
            var self = this;
            $.ajax({
                url : '/minecraft/api/players/'+self.param+'/moderation', // La ressource ciblée
                type : 'GET' // Le type de la requête HTTP.
            }).done(function(data) {
                $.ajax({
                    url : '/minecraft/api/players/'+self.param, // La ressource ciblée
                    type : 'GET' // Le type de la requête HTTP.
                }).done(function(data2) {
                    data.server = data2.server;
                    self.setData(data);
                });
            });
        }

        getData(data) {
            
        }
    }
});
