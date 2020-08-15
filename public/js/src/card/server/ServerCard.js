define([
    'src/card/Card'
], function(Card){
    return class ServerCard extends Card {

        constructor(cardNumber, options) {
            super(cardNumber, options);
            this.param = options.param;
            this.refreshCards = options.refresh;
            //$('.' + this.id).find("table").remove();
        }

        setData(data) {
            var server = this.param;
            this.clearCard();
            if(this.lang === "fr") {
                this.setTitle("Modification du serveur "+server);
                this.language.serverIs = "Le serveur "+server+" est";
                this.language.online = "en ligne";
                this.language.offline = "hors ligne";
                this.language.serverIsOn = "Ce serveur tourne en ? avec Via Version";
                this.language.whitelistIs = "la Whitelist est";
                this.language.maintenance = "Voulez vous lancer une maintenance ?";
                this.language.maintenanceTooltip = "Tout les joueurs présents vont être kick et seul les admins / builder ect pourront rejoindre le serveur";
            } else {
                this.setTitle("Modification of the server "+server);
                this.language.serverIs = "The server "+server+" is";
                this.language.online = "online";
                this.language.offline = "offline";
                this.language.serverIsOn = "The server is on ? with viaversion";
                this.language.whitelistIs = "the whitelist is";
                this.language.maintenance = "Do you want to start a maintenance ?";
                this.language.maintenanceTooltip = "All players will be kicked except staff who will be able to join the server";
            }
            var i = 1;
            var state, viaversion, whitelist;

            this.online = data.online;

            if (data.online) {
                state = '<div>'+this.language.serverIs+' <span class="text-success" id="server-online">'+this.language.online+'</span> <button class="btn btn-danger mb-2 form-confirm" id="online-toggle">'+this.language.turnOff+'</button></div>'
            } else {
                state = '<div>'+this.language.serverIs+' <span class="text-danger" id="server-online">'+this.language.offline+'</span> <button class="btn btn-success mb-2 form-confirm" id="online-toggle">'+this.language.turnOn+'</button></div>'
            }

            if (data.viaversion) {
                viaversion = '<span class="text-success" id="viaversion">'+this.language.enabled+'</span>'
            } else {
                viaversion = '<span class="text-danger" id="viaversion">'+this.language.disabled+'</span>'
            }

            if (data.whitelist) {
                whitelist = '<span class="text-success" id="whitelist">'+this.language.enabled+'</span>'
            } else {
                whitelist = '<span class="text-danger" id="whitelist">'+this.language.disabled+'</span>'
            }

            var self = this;
            $('.' + this.id).find(".table-container").append(
                '<div class="server-info">'
               +'  <ul class="text-left list-unstyled">'
               +'    <li class="first">'+state+'</li>'
               +'    <li>'+self.language.serverIsOn+' '+viaversion+' </li>'
               +'    <li>'+self.language.whitelistIs+' '+whitelist+' </li>'
               +'    <li><div id="maintenance-ask">'+self.language.maintenance+'<button class="btn btn-warning mb-2 form-confirm">Maintenance</button>'
               +'       <div id="maintenance-tooltip" data-popper-arrow>'+self.language.maintenanceTooltip+'</div>'
               +'    </div></li>'
               +'  </ul>'
               +'</div>'
            );

            $("#online-toggle").click(function() {
                self.startLoading();
                $.post( '/minecraft/api/servers/'+server, {online: !self.online})
                setTimeout(()=> {
                    self.refreshCards("servers");
                }, 5000);
            });
        }

        refresh() {
            this.startLoading();
            var self = this;
            $.ajax({
                url : '/minecraft/api/servers/'+self.param, // La ressource ciblée
                type : 'GET' // Le type de la requête HTTP.
            }).done(function(data) {
                self.setData(data);
            });

        }

        getData(data) {

        }
    }
});
