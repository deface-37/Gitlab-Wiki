const fs = require('fs');
const { argv } = require('process');

function makeCounter(initNumber) {
    let num = initNumber
    return () => num++;
}
const fileName = argv[2]

if (fileName === undefined) {
    console.error('Не введено имя файла');
    return
}

const filePath = fileName
if (!fs.existsSync(filePath)){
    console.error('Файла с таким именем не существует');
    return
}

let text = fs.readFileSync(filePath, {encoding: 'utf-8'})

const regex = /(\*\*)(\d+)(\. Тест-кейс)/g
const counter = makeCounter(1)

text = text.replace(regex, (_match, p1, _p2, p3) => {
    return p1 + counter() + p3 
})

fs.writeFileSync(filePath, text)
console.log('Запись завершена');