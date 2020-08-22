var fs = require('fs');
var argv = require('process').argv;
function makeCounter(initNumber) {
    var num = initNumber;
    return function () { return num++; };
}
var fileName = argv[2];
if (fileName === undefined) {
    console.error('Не введено имя файла');
    process.exit(1);
}
var filePath = fileName;
if (!fs.existsSync(filePath)) {
    console.error('Файла с таким именем не существует');
    process.exit(1);
}
var text = fs.readFileSync(filePath, { encoding: 'utf-8' });
var regex = /(\*\*)(\d+)(\. Тест-кейс)/g;
var counter = makeCounter(1);
var changedNumbers = new Map();
text = text.replace(regex, function (match, p1, num, p3, offset, input) {
    var newNum = counter();
    var isChanged = num != newNum;
    // если нет изменений, то возвращаем как есть
    if (!isChanged)
        return match;
    // если есть, то запоминаем старый и новый номер 
    changedNumbers.set(num, newNum);
    // и заменяем номер
    return p1 + newNum + p3;
});
var noteRegex = new RegExp("(?<=\\*\\*`\u041F\u0440\u0438\u043C\u0435\u0447\u0430\u043D\u0438\u0435\\..+)\\d+(?=.+\\n\\s*\\n)", 'g');
text = text.replace(noteRegex, function (match, offset, input) {
    return changedNumbers.get(match) || match;
});
fs.writeFileSync(filePath + '_copy', text);
console.log('Запись завершена');
//# sourceMappingURL=correct_numerationTS.js.map