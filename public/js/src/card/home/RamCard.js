define([
    'src/card/Card',
], function(Card){ 
    return class RamCard extends Card {

        constructor(cardNumber, options) {
            super(cardNumber, options);
            //$('.' + this.id).find("table").remove();
        }
        
        setData(data) {
            this.clearCard();
            this.setTitle("Utilisation de la mémoire par le serveur");
            var i = 1;
            $('.' + this.id).find(".table-container").append('<div class="chart-ram"><canvas id="ram"> </canvas></div>')
            var ctx = document.getElementById('ram').getContext('2d');
            var chart = new Chart(ctx, {
                type: "doughnut",
                data : {
                    datasets: [{
                        data: [data.usedmemory, data.freememory],

                        backgroundColor: [
                            'rgba(209, 54, 54, 1)',
                            'rgba(29, 196, 68, 1)',
                        ],
                    }],

                    // These labels appear in the legend and in the tooltips when hovering different arcs
                    labels: [
                        'Mémoire utilisée',
                        'Mémoire réstante'
                    ]
                },

                options: {
                    legend: {
                        position: "left",
                        labels : {
                            fontColor: 'rgb(255, 255, 255)'
                        }
                    }
                }
            });
            i++;
        }

        refresh() {
            this.startLoading();
            var self = this;
            $.ajax({
                url : '/minecraft/api/system/ram', // La ressource ciblée
                type : 'GET' // Le type de la requête HTTP.
            }).done(function(data) {
                self.setData(data);
            });
        }

        getData(data) {
            
        }
    }
});
