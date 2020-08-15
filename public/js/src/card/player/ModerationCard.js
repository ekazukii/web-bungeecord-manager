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
            if(this.lang === "fr") {
                this.setTitle("Modération du joueur");
                this.language.playerIsBanned = "Le joueur est ban";
                this.language.playerIsNotBanned = "Le joueur n'est pas ban";
                this.language.ban12h = "Bannir 12 heures";
                this.language.unban = "Unban";
                this.language.playerIsMuted = "Le joueur est mute";
                this.language.playerIsNotMuted = "Le joueur n'est pas mute";
                this.language.mute12h = "Muter 12 heures";
                this.language.unmute = "Demute";
                this.language.playerIsBanIp = "Le joueur est ban ip";
                this.language.playerIsNotBanIp = "Le joueur n'est pas ban ip";
                this.language.banIp12h = "Bannir l\'ip 12h";
                this.language.unbanIp = "Unban l'ip";
                this.language.playerIsOnServer = "Le joueur est sur le serveur";
                this.language.sendToLobby = "Envoyer au lobby";
            } else {
                this.setTitle("Moderatation about "+player);
                this.language.playerIsBanned = "Player is banned";
                this.language.playerIsNotBanned = "Player is not banned";
                this.language.ban12h = "Ban 12 hours";
                this.language.unban = "Unban";
                this.language.playerIsMuted = "Player is muted";
                this.language.playerIsNotMuted = "Player is not muted";
                this.language.mute12h = "Mute 12 hours";
                this.language.unmute = "Unmute";
                this.language.playerIsBanIp = "Player is ip banned";
                this.language.playerIsNotBanIp = "Player is not ip banned";
                this.language.banIp12h = "Ban ip 12 hours";
                this.language.unbanIp = "Unban ip";
                this.language.playerIsOnServer = "Player is on server";
                this.language.sendToLobby = "Send to lobby";
            }

            var ban, banip, mute;

            if (data.ban) {
                ban = this.language.playerIsBanned + ' <button class="btn btn-primary mb-2 form-confirm" id="ban-button">'+this.language.unban+'</button>'
            } else {
                ban = this.language.playerIsNotBanned + ' <button class="btn btn-danger mb-2 form-confirm" id="ban-button">'+this.language.ban12h+'</button>'
            }

            if (data.mute) {
                mute = this.language.playerIsMuted + ' <button class="btn btn-primary mb-2 form-confirm" id="mute-button">'+this.language.unmute+'</button>'
            } else {
                mute = this.language.playerIsNotMuted + ' <button class="btn btn-danger mb-2 form-confirm" id="mute-button">'+this.language.mute12h+'</button>'
            }

            if (data.banip) {
                banip = this.language.playerIsBanIp + ' <button class="btn btn-primary mb-2 form-warning" id="banip-button">'+this.language.unbanIp+'</button>'
            } else {
                banip = this.language.playerIsNotBanIp + '<button class="btn btn-danger mb-2 form-confirm" id="banip-button">'+this.language.banIp12h+'</button>'
            }

            $('.' + this.id).find(".table-container").append(
                '<div class="server-info">'
               +'  <ul class="text-left list-unstyled">'
               +'    <li class="first">'+mute+'</li>'
               +'    <li>'+self.language.playerIsOnServer+' '+data.server+' <button class="btn btn-warning mb-2 form-confirm" id="send-lobby">'+self.language.sendToLobby+'</button></li>'
               +'    <li>'+ban+'</li>'
               +'    <li>'+banip+'</li>'
               +'  </ul>'
               +'</div>'
            );

            $("#ban-button").click(function() {
                $.post('/minecraft/api/players/'+player+'/moderation', {ban: ($("#ban-button").text() === self.language.ban12h)})
                self.startLoading();
                self.refreshCards("players")
            });

            $("#mute-button").click(function() {
                $.post('/minecraft/api/players/'+player+'/moderation', {mute: ($("#mute-button").text() === self.language.mute12h)});
                self.startLoading();
                self.refreshCards("players")
            });

            $("#banip-button").click(function() {
                $.post('/minecraft/api/players/'+player+'/moderation', {banip: ($("#banip-button").text() === self.language.banIp12h)})
                self.startLoading();
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
                    data.moderation.server = data2.server;
                    self.setData(data.moderation);
                });
            });
        }

        getData(data) {

        }
    }
});
