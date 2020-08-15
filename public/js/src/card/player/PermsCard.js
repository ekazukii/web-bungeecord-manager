define([
    'src/card/Card',
], function(Card){
    return class PermsCard extends Card {

        constructor(cardNumber, options) {
            super(cardNumber, options);
            this.param = options.param;
            this.refreshCards = options.refresh;

            var self = this;

            $.ajax({
                url : '/minecraft/api/groups/', // La ressource ciblée
                type : 'GET' // Le type de la requête HTTP.
            }).done(function(data) {
                console.log(data)
                if(data.success) {
                    self.groups = data.groups;
                } else {
                    self.groups = []
                }
            });
        }

        setData(data) {
            var self = this;
            var player = this.param;
            this.clearCard();
            if(this.lang === "fr") {
                this.setTitle("Groupe et permissions de "+player);
                this.language.playerHasForPrefix = "Le joueur à pour prefix : ";
                this.language.playerHasNoPrefix = "Le joueur n'à pas de prefix personnalisé";
                this.language.editPrefix = "Modifier le prefix";
                this.language.editGroup = "Modifier le groupe : ";
            } else {
                this.setTitle("Group and permissions of "+player);
                this.language.playerHasForPrefix = "The prefix of the player is : ";
                this.language.playerHasNoPrefix = "the player doesn't have a personalised prefix";
                this.language.editPrefix = "Edit the prefix";
                this.language.editGroup = "Change the player's group : ";
            }

            var prefix, playerGroup;
            this.groups.forEach((group) => {
                if(group.name === data.group) {
                    playerGroup = group;
                }
            });

            if (data.prefix !== "") {
                prefix = this.language.playerHasForPrefix+' '+data.prefix
            } else {
                prefix = this.language.playerHasForPrefix;
            }


            $('.' + this.id).find(".table-container").append(
                '<div class="server-info">'
               +'  <ul class="text-left list-unstyled">'
               +'    <li class="first">'+prefix+'</li>'
               +'    <li class="form-inline">'+self.language.editPrefix+' <input type="text" id="prefix-edit" class="form-control col-md-6" placeholder="[Prefix]"/> <button id="prefix-confirm" class="btn btn-primary">'+self.language.submit+'</button></li>'
               +'    <li>'+playerGroup.desc+'</li>'
               +'    <li class="form-inline"> ' + self.language.editGroup
               +'       <select class="form-control col-md-4" id="group-edit">'
               +'           <option value="" selected disabled hidden>'+playerGroup.displayName+'</option>'
               +'       </select>'
               +'       <button id="group-confirm" class="btn btn-primary">'+self.language.submit+'</button>'
               +'    </li>'
               +'  </ul>'
               +'</div>'
            );

            this.groups.forEach(group => {
                $("#group-edit").append('<option value="'+group.name+'">'+group.displayName+'</option>')
            });

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
