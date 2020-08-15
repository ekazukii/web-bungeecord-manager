define([
    'src/card/Card',
], function(Card){
    return class PlayersCard extends Card {

        constructor(cardNumber, options) {
            super(cardNumber, options);
            this.param = options.param;
        }

        setData(data) {
            var server = this.param;
            this.clearCard();
            if(this.lang === "fr") {
                this.setTitle("Joueurs présents sur le serveur "+server);
                this.createTable("Joueur", "Groupe");
            } else {
                this.setTitle("Players on the server "+server);
                this.createTable("Player", "Group");
            }
            var i = 1;
            data.forEach(player => {
                $('.' + this.id).find("tbody tr:nth-child("+i+") td:nth-child(1)").html('<a href="/minecraft/joueur?p='+player.name+'">'+player.name+'</a>');
                $('.' + this.id).find("tbody tr:nth-child("+i+") td:nth-child(2)").text(player.group);
                i++;
            });
        }

        getData(data) {

        }

        refresh() {
            this.startLoading();
            var self = this;
            $.ajax({
                url : '/minecraft/api/servers/'+self.param+'/players', // La ressource ciblée
                type : 'GET' // Le type de la requête HTTP.
            }).done(function(data) {
                var i = 0
                function next() {
                    if (i < data.length) {
                        $.ajax({
                            url : '/minecraft/api/players/'+data[i].name+'/group', // La ressource ciblée
                            type : 'GET' // Le type de la requête HTTP.
                        }).done(function(data2) {
                            data[i].group = data2.group;
                            i++;
                            next()
                        });
                    } else {
                        self.setData(data);
                    }
                }
                next();
            });
        }
    }
});
