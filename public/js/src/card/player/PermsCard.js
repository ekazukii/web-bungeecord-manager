define([
    'src/card/Card',
], function(Card){ 
    return class PermsCard extends Card {

        constructor(cardNumber, options) {
            super(cardNumber, options);
            this.param = options.param;
            this.refreshCards = options.refresh;
        }
        
        setData(data) {
            var self = this;
            var player = this.param;
            this.clearCard();
            this.setTitle("Groupes et permissions de "+player);
            var prefix, displayGroup, desc;
            switch (data.group) {
                case "dev":
                    desc = "Le joueur est dev, il possede toutes les perms";
                    displayGroup = "Dev";
                    break;
                case "builder":
                    desc= "Le joueur est builder, il peut modifier les maps";
                    displayGroup = "Builder";
                    break;
                case "orga":
                    displayGroup = "Organisateur";
                    desc = "Le joueur est Orga, il modère et gère les parties";
                    break;
                case "frerot":
                    displayGroup = "Frérot";
                    desc = "Le joueur est frérot, il peut bouger librement";
                    break;
                case "default":
                    displayGroup = "Joueur";
                    desc = "Le joueur n'a pas de grade particulier";
                    break;
            }

            if (data.prefix !== "") {
                prefix = 'Le joueur a pour prefix personnalisé : '+data.prefix
            } else {
                prefix = 'Le joueur n\'a pas de prefix personnalisé'
            }


            $('.' + this.id).find(".table-container").append(
                '<div class="server-info">'
               +'  <ul class="text-left list-unstyled">'
               +'    <li class="first">'+prefix+'</li>'           
               +'    <li class="form-inline">Modifier le prefix <input type="text" id="prefix-edit" class="form-control col-md-6" placeholder="[Prefix]"/> <button id="prefix-confirm" class="btn btn-primary">Confirmer</button></li>'        
               +'    <li>'+desc+'</li>'
               +'    <li class="form-inline"> Modifier le groupe : '
               +'       <select class="form-control col-md-4" id="group-edit">'
               +'           <option value="" selected disabled hidden>'+displayGroup+'</option>'
               +'           <option value="default">Joueur</option>'
               +'           <option value="frerot">Frérot</option>'
               +'           <option value="orga">Organisateur</option>'
               +'           <option value="builder">Builder</option>'
               +'           <option value="dev">Dev</option>'
               +'       </select>'
               +'       <button id="group-confirm" class="btn btn-primary">Confirmer</button>'
               +'    </li>'
               +'  </ul>'
               +'</div>'
            );

            $("#prefix-confirm").click(function() {
                $.post('/minecraft/api/players/'+player+'/prefix', {prefix: $("#prefix-edit").val()})
                self.startLoading();
                setTimeout(()=> {
                    self.refresh();
                }, 200);
            });

            $("#group-confirm").click(function() {
                $.post('/minecraft/api/players/'+player+'/group', {group: $("#group-edit").val()})
                self.startLoading();
                setTimeout(()=> {
                    self.refreshCards("players");
                }, 200);
            });
        }

        refresh() {
            this.startLoading();
            var self = this;
            $.ajax({
                url : '/minecraft/api/players/'+self.param+'/group', // La ressource ciblée
                type : 'GET' // Le type de la requête HTTP.
            }).done(function(data) {
                $.ajax({
                    url : '/minecraft/api/players/'+self.param+'/prefix', // La ressource ciblée
                    type : 'GET' // Le type de la requête HTTP.
                }).done(function(data2) {
                    data.prefix = data2.prefix;
                    self.setData(data);
                });
            });
        }

        getData(data) {
            
        }
    }
});
