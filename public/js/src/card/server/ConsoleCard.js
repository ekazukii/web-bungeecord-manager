define([
    'src/card/Card'
], function(Card){ 
    return class ConsoleCard extends Card {

        constructor(cardNumber, options) {
            super(cardNumber, options);
            this.param = options.param;
            this.refreshCards = options.refresh;
            $('.' + this.id).find("table").remove();    
            $('.' + this.id + " div div:nth-child(1)").removeClass("green-dark orange-dark");
            $('.' + this.id + " div div:nth-child(2)").removeClass("green-gradient-horizontal orange-gradient-horizontal");

            $('.' + this.id + " div div:nth-child(1)").addClass("black");
            $('.' + this.id + " div div:nth-child(2)").addClass("black-lighter");

            $('.' + this.id).find(".table-container").removeClass("text-center").addClass("console-card");
            this.lines = [];
            
            this.clearCard();
            this.setTitle("Console du serveur "+server);
            $('.' + this.id).find(".table-container").append('<div id="console-command-container"><form id="console-command"> <label for="input-command-console"> > </label> <input type="text" name="input-command-console" id="input-command-console" autocomplete="off"/> </form> </div>');
            var server = this.param;
        }

        addLine(line) {
            if(this.lines.length >= 20) {
                this.lines.shift();
            }
    
            this.lines.push(line);
        }
        
        setData(data) {
            if(this.lines.length == 0) {
                this.lines = data.lines;
            } else {
                data.lines.forEach(line => {
                    this.addLine(line);
                });
            }

            data.lines.forEach(line => {
                $('.' + this.id).find("#console-command-container").before('<p>'+line+'</p>');
            });


            var self = this;
            $("#console-command").submit(function(event) {
                var val = $("#input-command-console").val();
                $.post('/minecraft/api/servers/'+server+'/command', {text: val, command: true}).done(function(data) {
                    self.refresh();
                })
            });
        }

        refresh() {
            var self = this;
            var data = {}
            if (this.lines.length != 0) data.lastline = this.lines[this.lines.length-1];
            $.ajax({
                url: "/minecraft/api/servers/"+self.param+"/console",
                type: 'GET',
                data: data
            }).done(function(data) {
                console.log(data);
                self.setData(data);
            });
        }

        getData(data) {

        }
    }
});
