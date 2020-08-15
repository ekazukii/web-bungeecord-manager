// Place third party dependencies in the lib folder
//
// Configure loading modules from the lib directory,
// except 'app' ones,

requirejs.config({
    "baseUrl": "js/lib",
    "paths": {
      "src": "/minecraft/js/src",
      "jquery": "//ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min",
      "chartjs": "//cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.min",
      "gsap": "//cdnjs.cloudflare.com/ajax/libs/gsap/3.2.6/gsap.min",
      "fontawesome": "//kit.fontawesome.com/5871b2f6ca",
      "popper": "//unpkg.com/@popperjs/core@2.4.0/dist/umd/popper.min"
    }
});

/**
 * Get the URL parameters
 * source: https://css-tricks.com/snippets/javascript/get-url-variables/
 * @param  {String} url The URL
 * @return {Object}     The URL parameters
 */
var getParams = function (url) {
	var params = {};
	var parser = document.createElement('a');
	parser.href = url;
	var query = parser.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		params[pair[0]] = decodeURIComponent(pair[1]);
	}
	return params;
};

requirejs(['jquery', 'src/card/home/CpuCard', 'src/card/home/RamCard', 'src/card/home/ScriptsCard', 'src/card/server/SendCard', 'src/card/server/PlayersCard', 'src/card/server/ServerCard', 'src/card/server/ConsoleCard', 'src/card/home/ServersCard', "src/card/home/WhitelistCard","src/card/player/ActionsCard", "src/card/player/ModerationCard", "src/card/player/PermsCard" ,"src/card/LeftCard" ,"chartjs", "gsap", 'fontawesome', "popper"], function ($, CpuCard, RamCard, ScriptsCard, SendCard, PlayersCard, ServerCard, ConsoleCard, ServersCard, WhitelistCard ,ActionsCard, ModerationCard, PermsCard, LeftCard, chartjs, gsap, fontawesome, popper) {
    var cardNumber = 0;

    var cardArray = []
    var unsortedCardArray = [];
    var serversCards = ["ServersCard", "ModeratinCard", "ServerCard"];
    var playersCards = ["ModeratinCard", "WhitelistCard", "ModerationCard", "PermsCard", "PlayersCard"];

    var cpuCard, ramCard, playersCard;
    var consoleCard;

    var pageType = "";
    var param;
    var lang = $('html')[0].lang;

    if(window.location.href.indexOf("serveur") != -1) {
        pageType = "serveur";
        param = getParams(window.location.href).s;
    } else if (window.location.href.indexOf("joueur") != -1) {
        param = getParams(window.location.href).p;
        pageType = "joueur";
    } else {
        pageType = "home";
    }

    var leftCard;

    $.ajax({
        url : '/minecraft/api/card/'+pageType,
        type : 'GET'
    }).done(function(data) {
        for (let i = 0; i < data.cards.length; i++) {
            var cardString = data.cards[i];
            console.log("[INFO] CREATING : " + cardString)
            var card;
            cardNumber++
            switch(cardString) {
                case "CpuCard":
                    card = new CpuCard(cardNumber, {refresh: refreshCards, lang: lang});
                    cpuCard = card;
                    break;
                case "RamCard":
                    card = new RamCard(cardNumber, {refresh: refreshCards, lang: lang});
                    ramCard = card;
                    break;
                case "ServersCard":
                    card = new ServersCard(cardNumber, {refresh: refreshCards, lang: lang});
                    break;
                case "WhitelistCard":
                    card = new WhitelistCard(cardNumber, {refresh: refreshCards, lang: lang});
                    break;
                case "ActionsCard":
                    card = new ActionsCard(cardNumber, {param: param, refresh: refreshCards, lang: lang});
                    break;
                case "ModerationCard":
                    card = new ModerationCard(cardNumber, {param: param, refresh: refreshCards, lang: lang});
                    break;
                case "PlayersCard":
                    card = new PlayersCard(cardNumber, {param: param, refresh: refreshCards, lang: lang});
                    playersCard = card;
                    break;
                case "SendCard":
                    card = new SendCard(cardNumber, {param: param, refresh: refreshCards, lang: lang});
                    break;
                case "ServerCard":
                    card = new ServerCard(cardNumber, {param: param, refresh: refreshCards, lang: lang});
                    break;
                case "ConsoleCard":
                    card = new ConsoleCard(cardNumber, {param: param, refresh: refreshCards, lang: lang});
                    consoleCard = card;
                    setInterval(() => {
                        consoleCard.refresh()
                    }, 1000);
                    break;
                case "ScriptsCard":
                    card = new ScriptsCard(cardNumber, {param: param, refresh: refreshCards, lang: lang});
                    break;
                case "PermsCard":
                    card = new PermsCard(cardNumber, {param: param, refresh: refreshCards, lang: lang});
                    break;
            }
            card.refresh();
            cardArray.push(card);
            unsortedCardArray.push({card: card, classString: cardString});
        }

        leftCard = new LeftCard({lang: lang})
        leftCard.refresh()
    });

    function refreshCards(type) {
        leftCard.refresh();
        unsortedCardArray.forEach(card => {
            if (type === "servers") {
                if(serversCards.includes(card.classString)) {
                    console.log("[INFO] REFRESHING : " + card.classString)
                    card.card.refresh();
                }
            } else if (type === "players") {
                if(playersCards.includes(card.classString)) {
                    console.log("[INFO] REFRESH : " + card.classString)
                    card.card.refresh();
                }
            }
        });
    }

    setInterval(() => {
        if($('#real-time').is(":checked")) {
            if (typeof cpuCard !== "undefined") {
                cpuCard.refresh();
            }

            if (typeof ramCard !== "undefined") {
                ramCard.refresh();
            }

            if (typeof playersCard !== "undefined") {
                playersCard.refresh();
            }

            leftCard.refresh();
        }
    }, 10000)

    function moveCard() {
        console.log(cardNumber);
        if (cardNumber >= 2) {
            var cardArraySorted = []
            console.log(cardArray.length + " : " + cardNumber);
            for (let i = 1; i <= cardNumber; i++) {
                cardArraySorted[cardArray[i-1].getNumberId()] = cardArray[i-1];
            }

            var left = $('#card-2').position().left;
            console.log(cardArraySorted);
            console.log(cardArray);
            for (let number = 1; number <= cardNumber; number++) {
                if (number % 2 == 0) {
                    // Nombre pair
                    if (number == 2) {
                        var values = cardArraySorted[number].getTransformValues()
                        cardArraySorted[number].to({duration: 2, x: values.x - left });
                        cardArraySorted[number].setId('card-1');
                    } else {
                        var values = cardArraySorted[number].getTransformValues()
                        cardArraySorted[number].to({duration: 2, y: values.y - 420});
                        cardArraySorted[number].setId('card-'+(number-2));
                    }
                } else {
                    // Nombre impair
                    if (number+1 == cardNumber) {
                        var values = cardArraySorted[number].getTransformValues()
                        cardArraySorted[number].to({duration: 2, x: values.x + left });
                        cardArraySorted[number].setId('card-'+(number-1));
                    } else if (number == cardNumber) {
                        var values = cardArraySorted[number].getTransformValues()
                        cardArraySorted[number].to({duration: 2, x: values.x + left, y: values.y - 420});
                        cardArraySorted[number].setId('card-'+(number-1));
                    } else {
                        console.log(number)
                        var values = cardArraySorted[number].getTransformValues()
                        cardArraySorted[number].to({duration: 2, y: values.y + 420})
                        cardArraySorted[number].setId('card-'+(number+2));
                    }
                }
            }
        }
    }
});
