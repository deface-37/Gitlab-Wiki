const fs = require('fs')
const { argv } =  require('process')

const changedNumbers = require('./change_num')

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

text = changedNumbers(text)

fs.writeFileSync(filePath.replace('.md', '_copy.md'), text)
console.log('Запись завершена');

/**
 * TODO: добавить опциональное логирование
 */