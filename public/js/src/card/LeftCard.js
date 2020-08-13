define([], function(){ 

    return class LeftCard {

        constructor(options) {
        }
        
        setData(data) {
            this.clearCard();
            this.createTable("Joueur", "Serveur")
            var i = 1;
            data.forEach(player => {
                $('.card-left').find("tbody tr:nth-child("+i+") td:nth-child(1)").html('<a href="/minecraft/joueur?p='+player.name+'">'+player.name+'</a>');
                $('.card-left').find("tbody tr:nth-child("+i+") td:nth-child(2)").html('<a href="/minecraft/serveur?s='+player.server+'">'+player.server+'</a>');
                i++;
            });
        }

        getData(data) {
            
        }

        refresh() {
            var self = this;
            $.ajax({
                url : '/minecraft/api/players', // La ressource ciblée
                type : 'GET' // Le type de la requête HTTP.
            }).done(function(data) {
                self.setData(data);
            });
        }

        clearCard() {
            console.log()
            $('.card-left').find(".table-container").empty();
        }

        createTable(title1, title2) {
            var $table = $('<table class="table"></table>').appendTo($('.card-left').find('.table-container'));
            $table.append('<thead>'
                         +'<th class="th t-first">'+title1+'</th>'
                         +'<th class="th">'+title2+'</th>'
                         +'</thead>'
            );

            var $tbody = $('<tbody></tbody>').appendTo($table)

            for (let i = 0; i < 14; i++) {
                $tbody.append('<tr><td class="td t-first"></td><td class="td"></td></tr>');
            }
        }
    }
});
