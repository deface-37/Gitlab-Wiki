function showChangedTests(changedTests) {
  const changedNumbers = Array.from(changedTests).map(value => value[0] + '->' + value[1])
  console.log(`Измененные тест-кейсы: ${changedNumbers.join(', ')}\nВсего изменено: ${changedNumbers.length}`);
}

function changeInTests(text) {
  const changedNumbers = new Map()
  // const counter = makeCounter(1)
  let newNum = 0;
  const regex = /(\*\*)(\d+)(\. Тест-кейс)/g

  text = text.replace(regex, (match, p1, num, p3) => {
    newNum++
    const isChanged = num != newNum

    // если нет изменений, то возвращаем как есть
    if (!isChanged) return match

    // если есть, то запоминаем старый и новый номер 
    changedNumbers.set(num, newNum)
    
    // и заменяем номер
    return p1 + newNum + p3
  })

  // выводим в лог номера измененных тест-кейсов
  showChangedTests(changedNumbers)

  return {text, changedNumbers}
}

function changeInNotes({text, changedNumbers}) {
  const noteRegex = /(?<=\*\*`Примечание\..+)\d+(?=.+\r?\n\s*\r?\n)/g
  
  return text.replace(noteRegex, (match) => {
    return changedNumbers.get(match) || match
  })
}

function numberingCorrection(text) { 
  return changeInNotes(changeInTests(text))
}

function numberingCorrectionInWiki() {
  const contentNode = document.getElementById('wiki_content')
  
  contentNode.value = numberingCorrection(contentNode.value)
}

numberingCorrectionInWiki()