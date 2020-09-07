function showChangedTests(changedTests) {
  const changedNumbers = Array.from(changedTests).map(value => value[0] + '->' + value[1])
  console.log(`Измененные тест-кейсы: ${changedNumbers.join(', ')}\nВсего изменено: ${changedNumbers.length}`);
}

function changeInTests(text) {
  const changedNumbers = new Map()
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

// изменяет упоминая номеров в примечаниях
function changeInNotes({text, changedNumbers}) {
  const noteRegex = /(?<=\*\*`Примечание\..+)\d+(?=.+\r?\n\s*\r?\n)/g
  
  return text.replace(noteRegex, (match) => {
    return changedNumbers.get(match) || match
  })
}

// главная функция по преобразованию номеров
function numberingCorrection(text) { 
  return changeInNotes(changeInTests(text))
}

// преобразовывает номера при использовании в браузере
function numberingCorrectionInWiki() {
  const contentNode = document.getElementById('wiki_content')

  contentNode.value = numberingCorrection(contentNode.value)
}

// вкладки редактирования и предпросмотра тест-кейсов
const writeTab = document.querySelector('#edit_wiki_slug li.md-header-tab:first-child')
if (writeTab === null) {
  const errorMessage = 'Не найдено вкладки редактирования текста'
  alert(errorMessage)
  throw new Error(errorMessage)
}
const previewTab = writeTab.nextElementSibling

const li = document.createElement('li')
li.classList.add('md-header-tab')

const button = document.createElement('button')
button.textContent = 'Исправить нумерацию'
button.style.outline = 'none'

li.append(button)

button.addEventListener('click', event => {
  event.preventDefault()
  event.stopPropagation()

  button.blur()

  numberingCorrectionInWiki()
})

button.addEventListener('mousedown', () => {
  button.parentNode.classList.add('active')
})

button.addEventListener('mouseup', () => {
  button.parentNode.classList.remove('active')
})

// при редактировании тест-кейсов показывать кнопку
writeTab.addEventListener('click', () => {
  li.style.display = 'flex'
})

// при предпросмотре скрывать кнопку
previewTab.addEventListener('click', () => {
  li.style.display = 'none'
})

previewTab.after(li)