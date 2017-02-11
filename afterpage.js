// Перекраска заголовка в зависимости от времени суток
var now = new Date();
var hoursNow = now.getHours();
console.log(hoursNow);

if(hoursNow > 6 && hoursNow <= 10) {
    repaintHeader(sunlight.morning);
} else if(hoursNow > 10 && hoursNow <= 17) {
    repaintHeader(sunlight.day);
} else if(hoursNow > 17 && hoursNow <= 23) {
    repaintHeader(sunlight.evening);
} else {
    repaintHeader(sunlight.night);
}