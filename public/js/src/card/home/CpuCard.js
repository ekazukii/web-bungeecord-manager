define([
    'src/card/Card',
], function(Card){
    return class CpuCard extends Card {
        constructor(cardNumber, options) {
            super(cardNumber, options);
            //$('.' + this.id).find("table").remove();
        }

        setData(data) {
            this.clearCard();
            var labels;
            if(this.lang === "fr") {
                this.setTitle("Utilisation du processeur par les serveurs");
                labels = ['Utilisateur', 'Système', 'Restant'];
            } else {
                this.setTitle("CPU usage by the servers");
                labels = ['User', 'System', 'Idle'];
            }

            var i = 1;
            $('.' + this.id).find(".table-container").append('<div class="chart-cpu"><div><canvas id="cpu-1"> </canvas></div><div><canvas id="cpu-2" </canvas></div><div><canvas id="cpu-3"> </canvas></div><div><canvas id="cpu-4"> </canvas></div></div>')
            data.forEach(cpu => {
                var ctx = document.getElementById('cpu-'+i).getContext('2d');
                var chart = new Chart(ctx, {
                    type: "doughnut",
                    data : {
                        datasets: [{
                            data: [cpu.user, cpu.sys, cpu.idle],

                            backgroundColor: [
                                'rgba(209, 54, 54, 1)',
                                'rgba(128, 128, 128, 1)',
                                'rgba(29, 196, 68, 1)',
                            ],
                        }],

                        // These labels appear in the legend and in the tooltips when hovering different arcs
                        labels: labels
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
            });
        }

        refresh() {
            this.startLoading();
            var self = this;
            $.ajax({
                url : '/minecraft/api/system/cpu', // La ressource ciblée
                type : 'GET' // Le type de la requête HTTP.
            }).done(function(data) {
                self.setData(data);
            });
        }
    }
});
