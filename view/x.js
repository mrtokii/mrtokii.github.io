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
	$searchBox.show();
	pics.empty();
	questions = [];
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

	if(package.note !== undefined)
		links.append(note(package.note));

	list.forEach(function(item, i, arr) {
		var id = item.id;
		var title = item.title;

		if (package.questions[id].pages.length < 1) {
			links.append( link(id, missingBadge + ' ' + (id + 1) + ': ' + title) );
		} else {
			links.append( link(id, (id + 1) + ': ' + title) );
		}

		
	});
	
	links.append( link(-1, 'Показать сразу все') );	
	links.append( caption('Y') );	
}






function link(id, text) {
	if(id === '') {
		return '<span onClick="x()" class="x-link">' + text + '</span>';
	} else {
		return '<span onClick="q(' + id + ')" class="x-link">' + text + '</span>';
	}
}

function caption(text) {
	return '<span class="x-caption">' + text + '</span>';
}

function note(text) {
	return '<span class="x-note">' + text + '</span>';
}

function captionLink(text, url) {
	return '<span class="x-caption"><a href="' + url + '" target="_blank">' + text + '</a></span>';
}

function image(url) {
	return '<img src="' + url + '" />';
}





function getPages(array) {
	var outArray = [];

	if(array == '')
		return outArray;

	var commaSeparated = array.split(',');

	for(var i = 0; i < commaSeparated.length; i++) {
		var progression = commaSeparated[i].split('-');

		if(progression.length == 1) {
			outArray.push( parseInt(progression[0]) );
		} else {
			for(var j = parseInt(progression[0]); j <= parseInt(progression[1]); j++) {
				outArray.push( parseInt(j) );
			}
		}
	}

	outArray.sort(function(a, b) {
  		return a - b;
	});

	return outArray;
}

// ====================================

function q(id) {
	$searchBox.hide();
	scrollTo(0, 0);
	links.empty();

	// Если выбран один конкретный вопрос
	if(id >= 0) {
		var current = package.questions[id];
		var pages = getPages(current.pages);

		// Меняем заголовок на название вопроса
		$('#x-title').html(current.name);

		showPages(current, 0);
	} else {
		if(package.note !== undefined)
			links.append(note(package.note));

		package.questions.forEach(function(quest, i, arr) {
			showPages(quest, i+1);
		});	
	}

	// Добавляем кнопку для возврата назад
	pics.append(link('', 'Назад к списку'));

	window.scrollTo(0, 0);
}

// Показывает страницы данного вопроса
function showPages(quest, number) {
	var pages = getPages(quest.pages);

	// Если нужно расширенное представление страницы
	if(number != 0)
		pics.append(caption('[' + number + '] ' + quest.name + ': '));

	// Показываем заметку, если есть
	if(quest.note !== undefined)
		pics.append(note(quest.note));

	// Если фотографии в вопросе отсутствуют
	if(pages.length == 0) {
		// Показываем пустую картинку
		pics.append(captionLink('Страница отсутствует', missingPath));
		pics.append(image(missingPath));
		return;
	} 

	// Перебираем все страницы вопроса
	pages.forEach(function(page, i, arr) {
		var path = pathToImg(page);	
		var linkText = 'Сохранить страницу #' + page;

		// Показываем ссылку и картинку
		pics.append(captionLink(linkText, path));
		pics.append(image(path));		
	});	
}

// ====================================

/*function q(question) {
	$searchBox.remove();
	scrollTo(0, 0);
	$('#x-title').css('font-size', '12px');	
	
	if(question == -1) {
		package.questions.forEach(function(item, i, arr) {
			if (item.pages.length < 1) {
				pics.append('<span class="x-caption"><a href="' + missingPath + '" target="_blank">' + missingBadge + ' [' + (i + 1) + '] ' + item.name + '</a></span>');
				pics.append('<img src="' + missingPath + '" />');
			} else {
				getPages(item.pages).forEach(function(item2, j, arr) {
					var path = pathToImg(item2);
					
					pics.append('<span class="x-caption"><a href="' + path + '" target="_blank">Сохранить [' + (i + 1) + '] ' + item.name + ' (' + (j + 1) + ')</a></span>');
					pics.append('<img src="' + path + '" />');
				});
			}
		});
	} else {
		$('#x-title').html(package.questions[question].name);

		if(package.questions[question].note !== undefined)
			pics.append(note(package.questions[question].note));

		if (getPages(package.questions[question].pages).length < 1) {
			pics.append('<span class="x-caption"><a href="' + missingPath + '" target="_blank">Страница отсутствует</a></span>');
			pics.append('<img src="' + missingPath + '" />');
		} else {
			getPages(package.questions[question].pages).forEach(function(item, i, arr) {
				var path = pathToImg(item);
				
				pics.append('<span class="x-caption"><a href="' + path + '" target="_blank">Сохранить страницу #' + item + '</a></span>');
				pics.append('<img src="' + path + '" />');
			});
		}
	}
	
	links.hide();
	window.scrollTo(0, 0);
	
	pics.append('<span class="x-caption">Обнови страницу, чтобы открыть список вопросов</span>');
}*/

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
		.css('color', text);
		/*.css('box-shadow', '0px -18px 20px 30px ' + background);*/
}