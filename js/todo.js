'use strict'

// element selector
const $ = (selector) => document.querySelector(selector)

// active group
let activeGroup = null
// sets the active group
const setActiveGroup = group => {
    if (group)
        activeGroup = group
}

// get the active group
const getActiveGroup = () => {
    if (activeGroup)
        return activeGroup // object
    alert('Pick a group first')
}

// creates a list object
const createList = (text, checked = false) => {
    return {
        text,
        done: checked,
        time: Date.now()
    }
}

// creates a list group object
const ListHolder = (listName) => {
    let list = []
    let counter = 1

    return {
        listName,
        getList: () => list,
        addTodo: todo => {
            todo._id = counter
            list.push(todo)
            localStorage.setItem(listName, todo)
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

// creating 2 list groups: personalList and shoppingList
const personalList = ListHolder('Personal List')
const shoppingList = ListHolder('Shopping List')

// adding both groups to an array
const taskGroups = [personalList, shoppingList]

// creates a List element
const createListElement = item => {
    const list = document.createElement('li') // Node/Element
    const checkInput = document.createElement('input')
    checkInput.setAttribute('type', 'checkbox')
    checkInput.checked = item.done
    checkInput.addEventListener('change', () => {
        item.done = !item.done
        renderList(getActiveGroup().getList())
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

// inserts an array of List Elements to the DOM
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

// on page loaded
window.addEventListener('load', () => {
    // set the active list group to personalList
    setActiveGroup(personalList)

    // get the active list group's items
    renderList(getActiveGroup().getList())

    // fetch the input element
    const input = $('input[name=taskname]')
    // fetch the button element
    const button = $('button')

    // addInputValue to the active list group
    const addInputValue = (value_str) => {
        if (value_str.trim() === '') return
        getActiveGroup().addTodo(createList(value_str))
        const allItems = getActiveGroup().getList() //array
        renderList(allItems)
    }
    // clears the input field
    const clearInput = input => input.value = ''
    // adds a keyboard event to the input element
    input.addEventListener('keyup', (evt) => {
        if (evt.keyCode === 13) {
            addInputValue(input.value)
            clearInput(input)
        }
    })
    // adds a click event to the button element
    button.addEventListener('click', () => {
        addInputValue(input.value)
        clearInput(input)
    })

    // get the tab element from the DOM
    const tab = $('nav.tabs')
    // loop through the array of list groups
    for (let group of taskGroups) {
        // create a button element
        const a = document.createElement('button')
        // add a click event to the button element above
        a.addEventListener('click', () => {
            console.log('the active group is now', group.listName)
            // change the list group
            setActiveGroup(group)
            // render the items in the active list group
            renderList(getActiveGroup().getList())
        })
        a.textContent = group.listName
        // append the button to the tab element
        tab.append(a)
    }
})