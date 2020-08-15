define([
    'jquery',
], function($){
    return class Card {
        constructor(cardNumber, options) {
            if (cardNumber % 2 !== 0) {
                // Nombre impair
                this.id = "card-" + cardNumber;
                var newCardRow = $('#card-row-example').clone();
                newCardRow.attr('id', this.id + "-container")
                newCardRow.appendTo('#row-container');
                newCardRow.show();
                if ($("#row-container .row").length > 2) {
                    newCardRow.addClass("margin-top-50");
                }
                var card = newCardRow.children().first();
                card.attr('id', this.id);
                card.addClass(this.id);
            } else {
                this.id = "card-" + cardNumber;
                var cardRow = $("#row-container").children().last();
                var rowExample = $('#card-row-example')
                var card = rowExample.children().first().clone();
                card.appendTo(cardRow);
                card.attr('id', this.id);
                card.addClass(this.id)
            }

            this.lang = (options.lang || "en");
            this.language = {};
            if(this.lang === "fr") {
                this.language.submit = "Envoyer";
                this.language.turnOn = "Allumer";
                this.language.turnOff = "Eteindre";
                this.language.enabled = "activé";
                this.language.disabled = "désactivé";
                this.language.player = "Joueur";
                this.language.delete = "Supprimer";
                this.language.username = "Pseudo du joueur";
                this.language.add = "Ajouter";
            } else {
                this.language.submit = "Submit"
                this.language.turnOn = "Turn on";
                this.language.turnOff = "Turn off";
                this.language.enabled = "enabled";
                this.language.disabled = "disabled";
                this.language.player = "Player";
                this.language.delete = "Delete";
                this.language.username = "Username";
                this.language.add = "Add";
            }

            this.setVisibility(options.visibility || "show");
            this.setColor(options.color || 'orange');
            this.setTitle(options.y || 'Title');
        }

        getTransformValues() {
            var elem = $('.' + this.id)[0];
            // Return "matrix(1,0,1,0, x, y)"
            var transform = window.getComputedStyle(elem).getPropertyValue("transform");
            // Transform to [1,0,1,0,x,y]
            var values = transform.split('(').pop().split(')')[0].split(',');
            if (values[0] !== "none") {
                return ({x : Number(values[4]), 'y' : Number(values[5])});
            } else {
                return ({x : 0, 'y' : 0});
            }
        }

        setTitle(title) {
            $("." + this.id + " div div:nth-child(1) p").html(title);
            return this;
        }

        getTitle() {
            return $("." + this.id + " div div:nth-child(1) p").html();
        }

        setColor(color) {
            $('.' + this.id + " div div:nth-child(1)").removeClass("green-dark orange-dark");
            $('.' + this.id + " div div:nth-child(1)").addClass(color + "-dark");

            $('.' + this.id + " div div:nth-child(2)").removeClass("green-gradient-horizontal orange-gradient-horizontal");
            $('.' + this.id + " div div:nth-child(2)").addClass(color + "-gradient-horizontal");
            return this;
        }

        getColor() {

        }

        setVisibility(toggle) {
            if (toggle === "show") {
                $("." + this.id).show();
            } else {
                $("." + this.id).hide();
            }
            return this;
        }

        isVisible() {
            return $("." + this.id).is(":visible");
        }

        setId(id) {
            var card = $('.' + this.id);
            card.attr('id', id);
        }

        getId() {
            var card = $('.' + this.id);
            return card.attr('id')
        }

        getNumberId() {
            return this.getId().split('-')[1]
        }

        to(options) {
            gsap.to($('.' + this.id)[0], options);
        }

        clearCard() {
            $('.' + this.id).find(".table-container").empty();
        }

        startLoading() {
            if (!$('.' + this.id).find(".table-container").find('img').length)  {
                this.clearCard();
                $('.' + this.id).find(".table-container").append('<img src="/minecraft/img/loading.gif" alt="loading gif" class="loading-img"/>');
            }
        }

        createTable(title1, title2) {
            var $table = $('<table class="table"></table>').appendTo($("."+this.id).find('.table-container'));
            $table.append('<thead>'
                         +'<th class="th t-first">'+title1+'</th>'
                         +'<th class="th">'+title2+'</th>'
                         +'</thead>'
            );

            var $tbody = $('<tbody></tbody>').appendTo($table)

            for (let i = 0; i < 10; i++) {
                $tbody.append('<tr><td class="td t-first"></td><td class="td"></td></tr>');
            }
        }
    }
});
