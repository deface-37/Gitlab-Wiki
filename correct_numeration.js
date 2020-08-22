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
if (!fs.existsSync(filePath)) {
    console.error('Файла с таким именем не существует');
    return
}

let text = fs.readFileSync(filePath, { encoding: 'utf-8' })

const counter = makeCounter(1)
const regex = /(\*\*)(\d+)(\. Тест-кейс)/g

const changedNumbers = new Map()

text = text.replace(regex, (match, p1, num, p3) => {
    const newNum = counter()
    const isChanged = num != newNum

    // если нет изменений, то возвращаем как есть
    if (!isChanged) return match

    // если есть, то запоминаем старый и новый номер 
    changedNumbers.set(num, newNum)
    // и заменяем номер
    return p1 + newNum + p3
})

// const changedNumbersInNotes = ['Начальное значение']

const noteRegex = new RegExp(`(?<=\\*\\*\`Примечание\\..+)\\d+(?=.+\\r?\\n\\s*\\r?\\n)`, 'g')

text = text.replace(noteRegex, (match) => {
    return changedNumbers.get(match) || match
    // const newNum = changedNumbers.get(match)
    // if (newNum) {
    //     changedNumbersInNotes.push(`${match} - ${newNum}`)
    //     return newNum
    // }
    // return match
})

fs.writeFileSync(filePath.replace('.md', '_copy.md'), text)
console.log('Запись завершена');
// console.log('Заменены тест-кейсы: ' + changedNumbersInNotes);