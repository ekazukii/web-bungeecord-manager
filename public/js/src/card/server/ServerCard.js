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
            this.setTitle("Modération sur le serveur "+server);
            var i = 1;
            var state, viaversion, whitelist;

            this.online = data.online;

            if (data.online) {
                state = '<div>Le serveur '+server+' est <span class="text-success" id="server-online">en ligne</span> <button class="btn btn-danger mb-2 form-confirm" id="online-toggle">Eteindre</button></div>'
            } else {
                state = '<div>Le serveur '+server+' est <span class="text-danger" id="server-online">hors ligne</span> <button class="btn btn-success mb-2 form-confirm" id="online-toggle">Allumer</button></div>'
            }

            if (data.viaversion) {
                viaversion = '<span class="text-success" id="viaversion">activé</span>'
            } else {
                viaversion = '<span class="text-danger" id="viaversion">désactivé</span>'
            }

            if (data.whitelist) {
                whitelist = '<span class="text-success" id="whitelist">activé</span>'
            } else {
                whitelist = '<span class="text-danger" id="whitelist">désactivé</span>'
            }

            $('.' + this.id).find(".table-container").append(
                '<div class="server-info">'
               +'  <ul class="text-left list-unstyled">'
               +'    <li class="first">'+state+'</li>'
               +'    <li>Ce serveur tourne en 1.15.2 avec Via Version '+viaversion+' </li>'           
               +'    <li>la Whitelist est '+whitelist+' </li>'        
               +'    <li><div id="maintenance-ask">Voulez vous lancer une maintenance ? <button class="btn btn-warning mb-2 form-confirm">Maintenance</button>'
               +'       <div id="maintenance-tooltip" data-popper-arrow>Tout les joueurs présents vont être kick et seul les admins / builder ect pourront rejoindre le serveur</div>'
               +'    </div></li>'
               +'  </ul>'
               +'</div>'
            );

            var self = this;
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
