define([
    'src/card/Card',
], function(Card){
    return class ServersRam extends Card {

        constructor(cardNumber, options) {
            super(cardNumber, options);
        }

        setData(data) {
            this.clearCard();
            if(this.lang === "fr") {
                this.setTitle("Listes des serveurs");
                this.createTable("Serveurs en ligne", "Serveur hors ligne");
            } else {
                this.setTitle("Servers list");
                this.createTable("Online servers", "Offline servers");
            }

            var iOff = 1;
            var iOn = 1;
            data.forEach(server => {
                if (server.online) {
                    $('.' + this.id).find("tbody tr:nth-child("+iOn+") td:nth-child(1)").html('<a href="/minecraft/serveur?s='+server.name+'">'+server.displayName+'</a>')
                    iOn++;
                } else {
                    $('.' + this.id).find("tbody tr:nth-child("+iOff+") td:nth-child(2)").html('<a href="/minecraft/serveur?s='+server.name+'">'+server.displayName+'</a>')
                    iOff++;
                }
            });
        }

        getData(data) {

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
    }
});
