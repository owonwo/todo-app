const $ = (selector) => document.querySelector(selector)
let activeGroup = null
const getActiveGroup = () => {
    if (activeGroup)
        return activeGroup // object
    alert('Pick a group first')
}

const createList = (text) => {
    return {
        text,
        remove: () => {
            personalList.deleteTodo(this._id)
        },
        done: false,
        time: Date.now()
    }
}

const ListHolder = (listName) => {
    let list = []
    let counter = 1

    return {
        listName,
        getList: () => list,
        addTodo: todo => {
            todo._id = counter
            list.push(todo)
            counter++
        },
        deleteTodo: todo_id => {
            let newRecord = []
            for (let item of list) {
                if (item._id !== todo_id) newRecord.push(item)
            }
            list = newRecord
        }
    }
}

const personalList = ListHolder('Personal List')
const shoppingList = ListHolder('Shoppig List')

const taskGroups = [personalList, shoppingList]

const createListElement = item => {
    const list = document.createElement('li') // Node/Element
    const checkInput = document.createElement('input')
    checkInput.setAttribute('type', 'checkbox')

    const delButton = document.createElement('button')
    delButton.textContent = 'delete'
    delButton.addEventListener('click', () => {
        getActiveGroup().deleteTodo(item._id)
        renderList(getActiveGroup().getList())
    })

    list.append(checkInput)
    list.append(item.text)
    list.append(delButton)

    return list
}

const renderList = (list) => {
    const ul = $('ul')
    ul.innerHTML = ''
    for (let item of list) {
        ul.append(createListElement(item))
    }
}

window.addEventListener('load', () => {
    const input = $('input[name=taskname]')
    const button = $('button')

    button.addEventListener('click', () => {
        if (input.value === '') return
        getActiveGroup().addTodo(createList(input.value))

        const allItems = getActiveGroup().getList() //array
        renderList(allItems)
        input.value = ''
    })

    const tab = $('nav.tabs')
    for (let group of taskGroups) {
        const a = document.createElement('button')
        a.addEventListener('click', () => {
            console.log('the active group is now', group.listName)
            activeGroup = group
            renderList(getActiveGroup().getList())
        })

        a.textContent = group.listName
        tab.append(a)
    }
})