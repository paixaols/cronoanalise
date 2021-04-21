const form = document.querySelector('form')
const ul = document.querySelector('ul')
const buttonClear = document.getElementById('button-clear')
const buttonAdd = document.getElementById('button-add')
const buttonSave = document.getElementById('button-save')
const input = document.getElementById('item')
let itemsArray = localStorage.getItem('items')
    ? JSON.parse(localStorage.getItem('items'))
    : []

localStorage.setItem('items', JSON.stringify(itemsArray))
const data = JSON.parse(localStorage.getItem('items'))

const liMaker = (item) => {
    const li = document.createElement('li')
    // li.textContent = item[0] + ' ' + item[1] + '. ' + item[2]
    li.textContent = item[0] + '. ' + item[1]
    ul.appendChild(li)
}

const addItem = () => {
    var date = new Date()
    // let item = [date.toLocaleDateString('pt-BR'), date.toLocaleTimeString('pt-BR'), input.value]
    let item = [date.toLocaleString('pt-BR'), input.value]
    itemsArray.push(item)
    localStorage.setItem('items', JSON.stringify(itemsArray))
    liMaker(item)
    input.value = ''
}

form.addEventListener('submit', function (e) {
    e.preventDefault()
    addItem()
})

data.forEach((item) => {
    liMaker(item)
})

buttonAdd.addEventListener('click', function () {
    if (input.value != '') {
        addItem()
    }
})

buttonClear.addEventListener('click', function () {
    localStorage.clear()
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild)
    }
    itemsArray.length = 0
})

buttonSave.addEventListener('click', function () {
    // let csvContent = "data:text/csv;charset=utf-8," + itemsArray.map(e => e.join(",")).join("\n")
    let csvContent = "data:text/csv;charset=utf-8," + itemsArray.map(e => e[0].split(' ').join(",")+','+e[1]).join("\n")
    var encodedUri = encodeURI(csvContent)
    var link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "download.csv")
    document.body.appendChild(link)// Required for FF
    link.click()
})
