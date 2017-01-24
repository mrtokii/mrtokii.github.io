var contentPath = '../../content/';
var missingPath = '../missing.JPG';
var missingBadge = '<span class="warning">[Отсутствует]</span>';
var pics;
var questions = [];
var package;

// Getting package
var hash = window.location.hash.slice(1);
var hashArr = hash.split('/');
var packageID = hashArr[0];
var questionID = hashArr[1];

var packagePath = contentPath + packageID + '/package.json';
console.log("package " + packagePath);

$.getJSON( packagePath, function( json ) {
	console.log("package arrived " + json.id);
	package = json;
	pics = $('#pics');

	if(questionID > package.questions.length) {
		document.write('Wrong question ID!');
	} else {
		x();
	}
}).fail(function() {
    document.write('Wrong package ID!');
});

$(document).ready(function() {
	
}); 

function x() {
	document.title = package.title;
	$('#x-title').text(package.title);
	getQuestions();
	q(questionID);
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

function q(question) {
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
	window.scrollTo(0, 0);
}

function pathToImg(num) {
	if(num < 10)
		num = '0' + num;
	return contentPath + packageID + '/' + package.imgPathBefore + num + package.imgPathAfter;
}