var cardsStorage = [
	{
		sem: 1,
		listId: '577c0536fcda73c78768bb15'
	},
	{
		sem: 2,
		listId: '577c0541ad7de7ac31ae964c'
	},
	{
		sem: 3,
		listId: '577c05448bb487fea2a1c5ac'
	}
];


/*var semLists = [
	'577c0536fcda73c78768bb15',
	'577c0541ad7de7ac31ae964c',
	'577c05448bb487fea2a1c5ac'
];*/

var importantLabelId = '5633819519ad3a5dc2f82f25';
var bookLabelId = '584ec0237a7de3854d10ef36';
var linkLabelId = '584ec01e920fc525a84b4781';

var trelloService = {
	api_key: 'a0f529051d1523220f01c0af252d23eb',
	
	get: function(request, callback) {
		var x = new XMLHttpRequest();
		var str = 'https://api.trello.com/1/'
		+ request
		+ 'key=' + this.api_key;
		x.open('GET', str, true);
		x.onload = function() {
			callback(JSON.parse(x.responseText));
		}
		x.send(null);
	}
	
};

//https://api.trello.com/1/lists/564cac3db1c31a8ce6ef96b2?cards=open&card_fields=name,desc?key=a0f529051d1523220f01c0af252d23eb