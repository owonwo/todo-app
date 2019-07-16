'use strict'


const $ = (selector) => document.querySelector(selector)
let activeGroup = null
const getActiveGroup = () => {
    if (activeGroup)
        return activeGroup // object
    alert('Pick a group first')
}

const createList = (text, checked = false) => {
    return {
        text,
        done: checked,
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
personalList.addTodo(createList('Get something from the shop', true))
personalList.addTodo(createList('Dance around the park.'))
personalList.addTodo(createList('Nothing really.'))
personalList.addTodo(createList('Fancy Coding.'))
personalList.addTodo(createList('Kill sy', true)) 
personalList.addTodo(createList('Kill somebody', true))

const taskGroups = [personalList, shoppingList]

const createListElement = item => {
    const list = document.createElement('li') // Node/Element
    const checkInput = document.createElement('input')
    checkInput.setAttribute('type', 'checkbox')
    checkInput.checked = item.done
    checkInput.addEventListener('change', () => {
        item.done = !item.done
    })

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

    const sorted = list.sort(a => {
        return a.done ? 1 : -1;
    })
    /* 
    const before = []
     const after = []
     for (let item of list) 
         (item.done) ? after.push(item) : before.push(item)
    
     for (let item of before.concat(after)) {
     for (let item of [...before, ...after]) {
    */
    for (let item of sorted) {
        ul.append(createListElement(item))
    }
}

window.addEventListener('load', () => {
    renderList(personalList.getList())

    const input = $('input[name=taskname]')
    const button = $('button')
    const addInputValue = (value_str) => {
        if (value_str.trim() === '') return
        getActiveGroup().addTodo(createList(value_str))
        const allItems = getActiveGroup().getList() //array
        renderList(allItems)
    }
    const clearInput = input => input.value = ''
    input.addEventListener('keyup', (evt) => {
        if (evt.keyCode === 13) {
            addInputValue(input.value)
            clearInput(input)
        }
    })
    button.addEventListener('click', () => {
        addInputValue(input.value)
        clearInput(input)
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