define([
    'src/card/Card',
], function(Card){
    return class WhitelistCard extends Card {

        constructor(cardNumber, options) {
            super(cardNumber, options);
        }

        setData(data) {
            var self = this;
            this.clearCard();
            if(this.lang === "fr") {
                this.setTitle("Whitelist de tout les serveurs");
                this.language.whitelistState = "La whitelist est actuellement";
                this.language.addToWhitelist = "Ajouter à la whitelist : ";
            } else {
                this.setTitle("Global whitelist");
                this.language.whitelistState = "Whitelist is currently";
                this.language.addToWhitelist = "Add to whitelist : ";
            }

            var whitelistTxt;

            if (data.whitelist) {
                whitelistTxt = '<div class="whitelist-info">'+this.language.whitelistState+' <span class="text-warning" id="whitelist">'+this.language.enabled+'</span> <button class="btn btn-danger mb-2 form-confirm" id="whitelist-toggle">'+this.language.turnOff+'</button></div>'
            } else {
                whitelistTxt = '<div class="whitelist-info">'+this.language.whitelistState+' <span class="text-danger" id="whitelist">'+this.language.disabled+'</span> <button class="btn btn-warning mb-2 form-confirm" id="whitelist-toggle">'+this.language.turnOn+'</button></div>'
            }
            this.whitelist = data.whitelist;

            $("."+this.id).find('.table-container').prepend(whitelistTxt)
            this.createTable(this.language.player, this.language.delete);
            $("."+this.id).find('.table-container').find("table").addClass("whitelist-table")
            var i = 0;
            data.forEach(player => {
                i++;
                $('.' + this.id).find("tbody tr:nth-child("+i+") td:nth-child(1)").html(player.username)
                $('.' + this.id).find("tbody tr:nth-child("+i+") td:nth-child(2)").html('<button class="btn btn-danger mb-2 form-confirm whitelist-delete" id="'+player.uuid+'">'+self.language.delete+'</button>')
            });

            $("."+this.id).find('.table-container').append(
             '<form class="form-inline form container margin-top-10">'
            +'  <div class="form-group"><label for="whitelist-input" class="whitelist-label col">'+self.language.addToWhitelist+' </label></div>'
            +'  <div class="form-group">'
            +'    <input type="text" class="form-control col-md-9" placeholder="'+self.language.username+'" id="whitelist-input">'
            +'    <div class="col-md-3"><button class="btn btn-primary mb-6 form-confirm" id="whitelist-confirm" onclick="return false;">'+self.language.add+'</button></div>'
            +'  </div>'
            +'</form>')

            var self = this;
            $("#whitelist-toggle").click(function() {
                self.startLoading();
                $.post( '/minecraft/api/whitelist', {whitelist: !self.whitelist});
                setTimeout(()=> {
                    self.refresh();
                }, 200);
            });

            $("#whitelist-confirm").click(function() {
                $.post( '/minecraft/api/whitelist/uuids', {username: $("#whitelist-input").val()});
                self.startLoading();
                setTimeout(()=> {
                    self.refresh();
                }, 200);
            });

            $(".whitelist-delete").click(function() {
                self.startLoading();
                $.ajax({
                    url : '/minecraft/api/whitelist/uuids',
                    type : 'DELETE',
                    data: {uuid: $(this).attr('id')}
                }).done((data) => {
                    self.refresh();
                })
            });
        }

        getData(data) {

        }

        refresh() {
            this.startLoading();
            var self = this;
            $.ajax({
                url : '/minecraft/api/whitelist/uuids', // La ressource ciblée
                type : 'GET' // Le type de la requête HTTP.
            }).done(function(data) {
                $.ajax({
                    url : '/minecraft/api/whitelist', // La ressource ciblée
                    type : 'GET' // Le type de la requête HTTP.
                }).done(function(data2) {
                    data.whitelist = data2.whitelist;
                    self.setData(data)
                });
            });
        }
    }
});
