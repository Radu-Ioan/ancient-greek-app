import { bindInput } from './greek-keyboard-inline.js'

const inputs = document.querySelectorAll('.wordpiece-input')

inputs.forEach(inp => bindInput(inp))

const wordpieceForms = document.querySelectorAll(".wordpiece-form")
const container = document.querySelector("#wordpiece_tbody")

let totalForms = document.querySelector("#id_wordpiece-TOTAL_FORMS")
let initialForms = document.querySelector("#id_wordpiece-INITIAL_FORMS")

const addButton = document.querySelector("#add-form-btn")


// here I store, in order, the extra nodes placed after the initial forms
const extraFormNodes = []

function extraFormsCount() {
    let a = parseInt(totalForms.value)
    let b = parseInt(initialForms.value)

    return a - b
}

function addForm(e) {
    e.preventDefault()

    let newForm = null

    if (extraFormsCount() > 0) {
        // if extra forms displayed by django, clone one of them
        const lastIdx = wordpieceForms.length - 1
        newForm = wordpieceForms[lastIdx].cloneNode(true)

        newForm.children[2].children[0].addEventListener("click", removeForm)
    } else {
        // clone one already saved in database, and make the proper changes
        newForm = wordpieceForms[0].cloneNode(true)

        const removeBtn = document.createElement("button")
        removeBtn.type = "button"
        removeBtn.className = "inline-deletelink"
        removeBtn.addEventListener("click", removeForm)

        newForm.children[2].replaceChildren(removeBtn)
    }

    const newFormIdx = parseInt(totalForms.value) + 1

    // update the first column
    newForm.children[0].innerText = `${newFormIdx}`

    // update the content column
    let newInput = newForm.children[1].children[0]
    newInput.name = `wordpiece-${newFormIdx - 1}-content`
    newInput.id = "id_" + newInput.name
    newInput.value = ''
    bindInput(newInput)

    // update sentence and id hidden fields
    const idFieldName = `wordpiece-${newFormIdx - 1}-id`
    newForm.children[3].name = idFieldName
    newForm.children[3].id = "id_" + idFieldName
    newForm.children[3].removeAttribute("value")

    const sentenceFieldName = `wordpiece-${newFormIdx - 1}-sentence`
    newForm.children[4].name = sentenceFieldName
    newForm.children[4].id = "id_" + sentenceFieldName

    container.appendChild(newForm)
    extraFormNodes.push(newForm)

    totalForms.value = `${newFormIdx}`
}

function removeForm(e) {
    const pressedBtn = e.target
    const trForm = pressedBtn.parentNode.parentNode
    container.removeChild(trForm)

    // update the forms placed below the one deleted now
    const extraIdx = extraFormNodes.indexOf(trForm)

    for (let i = extraIdx + 1; i < extraFormNodes.length; i++) {
        const extraForm = extraFormNodes[i]
        const num = parseInt(extraForm.children[0].innerText)
        extraForm.children[0].innerText = `${num - 1}`
    }

    extraFormNodes.splice(extraIdx, 1)

    totalForms.value = `${parseInt(totalForms.value) - 1}`
}

// update the extra forms delivered by django
document.addEventListener("DOMContentLoaded", (e) => {
    const firstExtraNodeIdx = parseInt(initialForms.value)

    for (let i = firstExtraNodeIdx; i < parseInt(totalForms.value); i++) {
        const extraNode = container.children[i]

        const removeBtn = extraNode.children[2].children[0]

        removeBtn.addEventListener("click", removeForm)
        extraFormNodes.push(extraNode)
    }
})

addButton.addEventListener("click", addForm)

