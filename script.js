var searchBox;

var spinnerOpts = {
  lines: 11 // The number of lines to draw
, length: 26 // The length of each line
, width: 6 // The line thickness
, radius: 38 // The radius of the inner circle
, scale: 1.2 // Scales overall size of the spinner
, corners: 1 // Corner roundness (0..1)
, color: '#fff' // #rgb or #rrggbb or array of colors
, opacity: 0.25 // Opacity of the lines
, rotate: 0 // The rotation offset
, direction: 1 // 1: clockwise, -1: counterclockwise
, speed: 1.5 // Rounds per second
, trail: 35 // Afterglow percentage
, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
, zIndex: 2e9 // The z-index (defaults to 2000000000)
, className: 'spinner' // The CSS class to assign to the spinner
, top: '50%' // Top position relative to parent
, left: '50%' // Left position relative to parent
, shadow: false // Whether to render a shadow
, hwaccel: true // Whether to use hardware acceleration
, position: 'absolute' // Element positioning
}

var spinner = new Spinner(spinnerOpts).spin();

$(document).ready(function() {
	for (var i = 0; i < packagesAvailible.length; i++) {
		//packagesAvailible[i] = packagesPath + packagesAvailible[i] + '/package.json';
	}

	searchBox = document.getElementById('unisearch');
	$searchBox = $(searchBox);
	spinnerElement = document.getElementById('spinner');

	$( '.menu-item' ).click(function() {
	  	console.log('Clicked on ' + $(this).attr('sem'));
	  	$('.menu-item').removeClass('selected');
	  	$(this).addClass('selected');
	  	$searchBox.val('');
	  	showXpackages($(this).attr('sem'));
	}); 

	
	searchBox.oninput = function() {
	  var query = $searchBox.val();
	  
	  if(query == '') {
	    showXpackages(selectedSem()); 
	    return;  
	  }
	  
	  var qquestions = [];
	  $.each(packages, function(key, val){
		$.each(val.questions, function(key2, val2){  	
			if(val2.name.toLowerCase().indexOf(query.toLowerCase()) != -1) {
				var quest = {
					subject: val.title,
					title: val2.name,
					sem: val.sem,
					color: val.color,
					id: val.id,
					qid: key2
				};
				qquestions.push(quest);
			}	
		  });	
	  });
	  showSearchTitles(qquestions);
	};

	loadXpackages();
	getTrelloCards(semLists[0], 1);
	getTrelloCards(semLists[1], 2);
	getTrelloCards(semLists[2], 3);
});



var jobs = {
	packages: 0,
	cards: 0
};

jobs.run = function(type, amount) {	
	this[type] = amount;
	this.check();
};

jobs.check = function() {
	if(this.packages === 0 && this.cards === 0) {
		console.log('not busy');
	} else {
		console.log('busy');
	}
};

jobs.done = function(type) {
	if(this[type] !== 0) this[type]--;
	this.check();
};


function loadSemPackages(sem) {
	clearPackages();

	var paths = [];
	for(var i = 0; i < packagesAvailible.length; i++) {
		if(sem == packagesAvailible[i].sem) {

			for (var j = 0; j < packagesAvailible[i].list.length; j++) {
				paths[j] = packagesPath + packagesAvailible[i].list[j] + '/package.json';
			}

		}	
	}

	console.log(paths);
	loadPackages(paths);
}


function loadPackages(list) {
	$.each(list, function(key, pack) {
			$.getJSON(pack, function(json) {
				console.log( 'Package ' + json.title + ' has arrived');

				addPackage(json);
    	
			});
		});  
}

function addPackage(pck) {
	packages.push(pck);

	var tileName = '<b>' + pck.title + '</b><br /><small>' + pck.prof + '</small>';
	var imagePath = 'content/' + pck.id + '/logo.png';
	$('#content1').append(xTile(tileName, pck.color, '/view#' + pck.id, imagePath));
}

function clearPackages() {
	$('#content1').empty();
	packages = [];
}






var packagesLoaded = 0;
function loadXpackages() {
	$.each(packagesAvailible, function(key, val){
    	$.getJSON( val, function( json ) {
    		packagesLoaded++;
	    	console.log( 'Package ' + json.title + ' has arrived');

	    	packages.push(json);

	    	if(packagesLoaded == packagesAvailible.length) {
	    		console.log( 'Showing ' + selectedSem() + ' sem');
	    		showXpackages(selectedSem());
	    	}	    	
    	});
  	});  
}

function selectedSem() {
	return $('.menu-item.selected').attr('sem');
}

function showSearchTitles(ttl) {
	$('#content1').empty();
	var pckLoaded = 0;
	$.each(ttl, function(key, val){
		darkerColor = ColorLuminance(val.color, -0.1);
  		lighterColor = ColorLuminance(val.color, 0.1);
		var subjectElement = $('<span></span>')
    						.attr('class', 'subject')
    						.css('background-image', '-webkit-linear-gradient(top, ' + lighterColor + ' 0%, ' + val.color + ' 50%, ' + darkerColor + ' 100%)')
    						.css('background-image', 'linear-gradient(to bottom, ' + lighterColor + ' 0%, ' + val.color + ' 50%, ' + darkerColor + ' 100%)')
    						.css("color", isDark(hexToRgb(val.color)) ? 'white' : 'black')
    						.html(val.subject + ' (' + val.sem + ')');

    	var xElem = $('<a></a>')
    						.attr('id', 'xlink-' + '/view/q/#' + val.id + '/' + val.qid)
    						.attr('class', 'x-wide')
    						.attr('target', '_blank')
    						.attr('href', '/view/q/#' + val.id + '/' + val.qid);
    	xElem.append(subjectElement).append(' ').append(val.title);
		$('#content1').append(xElem);
		pckLoaded++; 	
  	});
}

function showXpackages(sem) {
	$('#content1').empty();
	var pckLoaded = 0;
	$.each(packages, function(key, val){
    	if(val.sem == sem) {
    		var tileName = '<b>' + val.title + '</b><br /><small>' + val.prof + '</small>';
    		var imagePath = 'content/' + val.id + '/logo.png';
    		$('#content1').append(xTile(tileName, val.color, '/view#' + val.id, imagePath));
    		pckLoaded++;
    	} 	
  	});

	$('#content1').append(xTile('<i class="fa fa-money fa-lg"></i> Пожертвовать копеечку на хостинг', '#BBDA7B', 'donate.html', 'donate_logo.png'));
	pckLoaded++;

  	if(pckLoaded % 2 != 0) {
  		$('#content1').append('<div style="display:block;width:130px;height:1px;margin:5px;float:left; background:transparent;"></div>');
  	}

  	showCards(sem);
}

function showCards(sem) {
	$('#content2').empty();
	var pckLoaded = 0;
	$.each(trelloCards, function(key, val){
    	if(val.sem == sem) {
    		var tileName = val.text;
    		if(val.url != '') {
    			var tile = linkTile(tileName, val.url);
    			if(val.important == true) {
    				tile.removeClass('regular-card');
    				tile.addClass('important-card');
    			} else if(val.book == true) {
            tile.removeClass('regular-card');
            tile.addClass('book-card');
          } else if(val.link == true) {
            tile.removeClass('regular-card');
            tile.addClass('link-card');
          }

    			$('#content2').append(tile);
    		} else {
    			$('#content2').append(textTile(tileName));
    		}
    		
    		pckLoaded++;
    	} 	
  	});

  	if(pckLoaded != 0) {
  		if(pckLoaded % 2 != 0) {
  			$('#content2').append('<div style="display:block;width:130px;height:1px;margin:5px;float:left; background:transparent;"></div>');
  		}
  	} else {
  		$('#content2').append('<div style="display:block;width:130px;height:1px;margin:5px;float:left; background:transparent;">пусто</div>');
  	}

  	
}

function xTile(text, color, url, image) {
  darkerColor = ColorLuminance(color, -0.2);
  lighterColor = ColorLuminance(color, 0.5);
  var xElemWrapper = $('<a></a>')
    						.attr('id', 'xlink-' + url)
    						.attr('class', 'x-link')
    						.attr('target', '_blank')
    						.attr('href', url)
    						.css('background-image', 'url(' + image + '), -webkit-linear-gradient(-15deg, ' + lighterColor + ' 0%, ' + color + ' 50%, ' + darkerColor + ' 100%)')
    						.css('background-image', 'url(' + image + '), linear-gradient(165deg, ' + lighterColor + ' 0%, ' + color + ' 50%, ' + darkerColor + ' 100%)')
    						.css('background-size', 'cover')
    						.css("color", isDark(hexToRgb(color)) ? 'white' : 'black');
  var xElem = $('<div></div>')
    						.attr('id', 'x-' + url)
    						.attr('class', 'x-item')
    						.html(text);
    						
  xElemWrapper.append(xElem);
  return xElemWrapper;
}

function wideTile(title, color, url) {
  darkerColor = ColorLuminance(color, -0.1);
  lighterColor = ColorLuminance(color, 0.1);
  var xElemWrapper = $('<a></a>')
    						.attr('id', 'xlink-' + url)
    						.attr('class', 'x-wide')
    						.attr('target', '_blank')
    						.attr('href', url)
    						.css('background-image', '-webkit-linear-gradient(top, ' + lighterColor + ' 0%, ' + color + ' 50%, ' + darkerColor + ' 100%)')
    						.css('background-image', 'linear-gradient(to bottom, ' + lighterColor + ' 0%, ' + color + ' 50%, ' + darkerColor + ' 100%)')
    						.css("color", isDark(hexToRgb(color)) ? 'white' : 'black')
    						.html(title);
  return xElemWrapper;
}

function linkTile(text, url) {
  var xElemWrapper = $('<a></a>')
    						.attr('class', 'x-link')
    						.attr('target', '_blank')
    						.attr('href', url)    		
    						.addClass('regular-card')			
    						.css('background-size', 'cover')
    						.css('color', 'white');
  var xElem = $('<div></div>')
    						.attr('class', 'x-item')
    						.html(text);
    						
  xElemWrapper.append(xElem);
  return xElemWrapper;
}

function textTile(text) {
  var xElemWrapper = $('<a></a>')
    						.attr('class', 'x-link')
    						.attr('target', '_blank')
    						.attr('href', '#')    						
    						.css('background', '#212121')
    						.css('color', 'white');
  var xElem = $('<div></div>')
    						.attr('class', 'x-item')
    						.html(text);
    						
  xElemWrapper.append(xElem);
  return xElemWrapper;
}

var listsLoaded = 0;
function getTrelloCards(listId, _sem) {
  document.body.appendChild(spinner.el);
  $('#body-wrap').css('opacity', '0');

  trelloService.get('lists/' + listId + '?cards=open&card_fields=name,labels,desc&', function(result) {
    for (var i = 0; i < result.cards.length; i++) {
      var current = result.cards[i];
      var card = {
        text: current.name,
        url: '',
        sem: _sem,
        important: false,
        book: false,
        link: false
      };

      if (current.desc != '') {
        card.url = current.desc;
      }

      if(typeof(current.labels[0]) != "undefined") {
      	if(current.labels[0].id == importantLabelId) {
      		card.important = true;
      	}
        if(current.labels[0].id == bookLabelId) {
          card.book = true;
        }
        if(current.labels[0].id == linkLabelId) {
          card.link = true;
        }
      }

      trelloCards.push(card);      
    }

    listsLoaded++;
    if(listsLoaded == semLists.length) {
      showCards(selectedSem()); 
      spinner.stop();  
      $('#body-wrap').css('opacity', '1'); 
    }
  });
}