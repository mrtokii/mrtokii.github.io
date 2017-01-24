var contentPath = '../content/';
var missingPath = 'missing.JPG';
var missingBadge = '<span class="warning">[Отсутствует]</span>';
var links, pics;
var questions = [];
var searchBox = document.getElementById('x-search');
var $searchBox = $(searchBox);

// Getting package
var packageID = window.location.hash.slice(1);

var packagePath = contentPath + packageID + '/package.json';
console.log("package " + packagePath);

$.getJSON( packagePath, function( json ) {
	console.log("package arrived " + json.id);
	package = json;

	applyStyle(package.color);
	links = $('#links');
	pics = $('#pics');
	
	x();
}).fail(function() {
    document.write('Wrong package ID!');
});

$(document).ready(function() {
	
}); 

function x() {
	document.title = package.title;
	$('#x-title').text(package.title);
	getQuestions();
	showLinks(questions);

}

function getQuestions() {
	package.questions.forEach(function(item, i, arr) {
		var el = {
			id: i,
			title: item.name
		};		
		questions.push(el);
	});
}

searchBox.oninput = function() {
	var query = $searchBox.val();
	
	if(query == '') {
		showLinks(questions);		
	}
	
	var qquestions = [];
	
	questions.forEach(function(item, i, arr) {
		if(item.title.toLowerCase().indexOf(query.toLowerCase()) != -1) {
			qquestions.push(item);
		}
	});
	
	showLinks(qquestions);
};

function showLinks(list) {
	links.empty();	
	list.forEach(function(item, i, arr) {
		var id = item.id;
		var title = item.title;

		if (package.questions[id].pages.length < 1) {
			links.append('<span onClick="q(' + id + ')" class="x-link">' + missingBadge + ' ' + (id + 1) + ': ' + title + '</span>');
		} else {
			links.append('<span onClick="q(' + id + ')" class="x-link"> ' + (id + 1) + ': ' + title + '</span>');
		}

		
	});
	
	links.append('<span onClick="q(-1)" class="x-link">Показать сразу все</span>');	
	links.append('<span class="x-caption">X</span>');	
}

function q(question) {
	$searchBox.remove();
	scrollTo(0, 0);
	$('#x-title').css('font-size', '12px');	
	
	if(question == -1) {
		package.questions.forEach(function(item, i, arr) {
			if (item.pages.length < 1) {
				pics.append('<span class="x-caption"><a href="' + missingPath + '" target="_blank">' + missingBadge + ' [' + (i + 1) + '] ' + item.name + '</a></span>');
				pics.append('<img src="' + missingPath + '" />');
			} else {
				item.pages.forEach(function(item2, j, arr) {
					var path = pathToImg(item2);
					
					pics.append('<span class="x-caption"><a href="' + path + '" target="_blank">Сохранить [' + (i + 1) + '] ' + item.name + ' (' + (j + 1) + ')</a></span>');
					pics.append('<img src="' + path + '" />');
				});
			}
		});
	} else {
		$('#x-title').html(package.questions[question].name);
		if (package.questions[question].pages.length < 1) {
			pics.append('<span class="x-caption"><a href="' + missingPath + '" target="_blank">Страница отсутствует</a></span>');
			pics.append('<img src="' + missingPath + '" />');
		} else {
			package.questions[question].pages.forEach(function(item, i, arr) {
				var path = pathToImg(item);
				
				pics.append('<span class="x-caption"><a href="' + path + '" target="_blank">Сохранить страницу #' + item + '</a></span>');
				pics.append('<img src="' + path + '" />');
			});
		}
	}
	
	links.hide();
	window.scrollTo(0, 0);
	
	pics.append('<span class="x-caption">Обнови страницу, чтобы открыть список вопросов</span>');
}

function pathToImg(num) {
	if(num < 10)
		num = '0' + num;
	return contentPath + packageID + '/' + package.imgPathBefore + num + package.imgPathAfter;
}

function applyStyle(background) {
	var text = isDark(hexToRgb(background)) ? 'white' : 'black';
	$('#x-search')
		.css('background-color', background)
		.css('color', text);
	$('#x-title')
		.css('background', background)
		.css('color', text)
		.css('box-shadow', '0px -18px 20px 30px ' + background);
}