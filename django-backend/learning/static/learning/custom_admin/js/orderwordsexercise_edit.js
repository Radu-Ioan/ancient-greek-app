import {bindInput} from './greek-keyboard-inline.js'
import {
    setupKeyboardSwitchBtn,
    updateInputsPrefix, updateInputsCounter, addRemoveListenerForInitialForms
} from "./custom_edit_utils.js";
import {
    CONTROLLED_INPUT_CLASSNAME,
    CONTROLLED_INPUT_SELECTOR,
    SWITCH_KEYBOARD_ID,
    CSS_INPUT_STYLE
} from "./custom_edit_utils.js";

setupKeyboardSwitchBtn(CONTROLLED_INPUT_SELECTOR)

const inputs = document.querySelectorAll(CONTROLLED_INPUT_SELECTOR)
inputs.forEach(inp => bindInput(inp))

const container = document.querySelector("#wordpiece_tbody")
let totalForms = document.querySelector("#id_wordpiece-TOTAL_FORMS")
let initialForms = document.querySelector("#id_wordpiece-INITIAL_FORMS")
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
    const deleteButton = newForm.children[2].children[0]
    const idInput = newForm.children[3]
    const sentenceInput = newForm.children[4]

    // set the proper current number
    const newCounter = parseInt(totalForms.value) + 1
    counterTd.innerText = `${newCounter}`
    // for id and names used by django
    const newCounter0 = newCounter - 1

    // update the input attributes
    updateInputsPrefix(newCounter0, contentInput, idInput, sentenceInput)

    contentInput.classList.add(CONTROLLED_INPUT_CLASSNAME)
    contentInput.classList.add(CSS_INPUT_STYLE)

    const gs = document.getElementById(SWITCH_KEYBOARD_ID)
    if (gs.checked) {
        bindInput(contentInput)
    }

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
        const idInput = extraForm.children[3]
        const sentenceInput = extraForm.children[4]

        const counter0 = num - 2
        updateInputsCounter(counter0, contentInput, idInput, sentenceInput)
    }

    extraFormNodes.splice(extraIdx, 1)

    totalForms.value = `${parseInt(totalForms.value) - 1}`
}

const getRemoveBtn = containerChildren => containerChildren[2].children[0]

addRemoveListenerForInitialForms(
    getRemoveBtn, extraFormNodes, totalForms, initialForms, container,
    removeForm
)

addButton.addEventListener("click", addForm)
