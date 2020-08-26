const fs = require('fs');
const { argv } = require('process');
function makeCounter(initNumber) {
    let num = initNumber;
    return () => num++;
}
const fileName = argv[2];
if (fileName === undefined) {
    console.error('Не введено имя файла');
    process.exit(1);
}
const filePath = fileName;
if (!fs.existsSync(filePath)) {
    console.error('Файла с таким именем не существует');
    process.exit(1);
}
let text = fs.readFileSync(filePath, { encoding: 'utf-8' });
const regex = /(\*\*)(\d+)(\. Тест-кейс)/g;
const counter = makeCounter(1);
const changedNumbers = new Map();
text = text.replace(regex, (match, p1, num, p3, offset, input) => {
    const newNum = counter();
    const isChanged = num != newNum;
    // если нет изменений, то возвращаем как есть
    if (!isChanged)
        return match;
    // если есть, то запоминаем старый и новый номер 
    changedNumbers.set(num, newNum);
    // и заменяем номер
    return p1 + newNum + p3;
});
const noteRegex = new RegExp(`(?<=\\*\\*\`Примечание\\..+)\\d+(?=.+\\n\\s*\\n)`, 'g');
text = text.replace(noteRegex, (match, offset, input) => {
    return changedNumbers.get(match) || match;
});
fs.writeFileSync(filePath + '_copy', text);
console.log('Запись завершена');
//# sourceMappingURL=correct_numerationTS.js.map