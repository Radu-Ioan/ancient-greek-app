import {bindInput} from './greek-keyboard-inline.js'
import {
    setupKeyboardSwitchBtn,
    updateInputsPrefix, updateInputsCounter,
    bindNewInputs, addRemoveListenerForInitialForms
} from "./custom_edit_utils.js";
import {
    CONTROLLED_INPUT_SELECTOR,
} from "./custom_edit_utils.js";

setupKeyboardSwitchBtn(CONTROLLED_INPUT_SELECTOR)

const inputs = document.querySelectorAll(CONTROLLED_INPUT_SELECTOR)
inputs.forEach(inp => bindInput(inp))

const prefix = "sentencepiece"
const container = document.querySelector(`#${prefix}_tbody`)
let totalForms = document.querySelector(`#id_${prefix}-TOTAL_FORMS`)
let initialForms = document.querySelector(`#id_${prefix}-INITIAL_FORMS`)
const addButton = document.querySelector("#add-form-btn")

// here I store, in order, the extra nodes placed after the initial forms
const extraFormNodes = []

function addForm() {
    const emptyFormRow = document.getElementById("id_empty-form")
    const newForm = emptyFormRow.cloneNode(true)

    // Remove the 'empty-form' class
    newForm.classList.remove("d-none")
    newForm.removeAttribute("id")

    const counterTd = newForm.children[0]
    const contentInput = newForm.children[1].children[0]
    const hiddenInput = newForm.children[2].children[0]
    const deleteButton = newForm.children[3].children[0]
    const idInput = newForm.children[4]
    const exerciseInput = newForm.children[5]

    // set the proper current number
    const newCounter = parseInt(totalForms.value) + 1
    counterTd.innerText = `${newCounter}`
    // for id and names used by django
    const newCounter0 = newCounter - 1

    // update the input attributes
    updateInputsPrefix(newCounter0, contentInput, hiddenInput, idInput, exerciseInput)

    bindNewInputs(contentInput)

    // add remove listener
    deleteButton.addEventListener("click", removeForm)

    container.appendChild(newForm)
    extraFormNodes.push(newForm)
    totalForms.value = `${newCounter}`
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

        const contentInput = extraForm.children[1].children[0]
        const hiddenInput = extraForm.children[2].children[0]
        // these variables may be actually reversed, but it doesn't matter since I
        // just update the prefix for name and id using a regular expression, i.e I
        // replace only the proper digits
        const idInput = extraForm.children[4]
        const exerciseInput = extraForm.children[5]

        const counter0 = num - 2
        updateInputsCounter(counter0, contentInput, hiddenInput, idInput, exerciseInput)
    }

    extraFormNodes.splice(extraIdx, 1)

    totalForms.value = `${parseInt(totalForms.value) - 1}`
}

const getRemoveBtn = containerChildren => containerChildren[3].children[0]

addRemoveListenerForInitialForms(
    getRemoveBtn, extraFormNodes, totalForms, initialForms, container,
    removeForm
)

addButton.addEventListener("click", addForm)
