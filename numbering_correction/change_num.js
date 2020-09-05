function makeCounter(initNumber) {
  return () => initNumber++;
}

function changeInTests(text) {
  const changedNumbers = new Map()
  const counter = makeCounter(1)
  
  const regex = /(\*\*)(\d+)(\. Тест-кейс)/g

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

  return {text, changedNumbers}
}

function changeInNotes({text, changedNumbers}) {
  const noteRegex = /(?<=\*\*`Примечание\..+)\d+(?=.+\n\s*\n)/g
  
  return text.replace(noteRegex, (match) => {
    return changedNumbers.get(match) || match
  })
}

function numberingCorrection(text) { 
  return changeInNotes(changeInTests(text))
}

module.exports = numberingCorrection