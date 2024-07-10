// This file is different than the one from learning/js/
import {bindInput, setInputNull, unbindInput} from "./greek-keyboard-inline.js";

export const CONTROLLED_INPUT_CLASSNAME = "controlled-input"
export const CONTROLLED_INPUT_SELECTOR = `.${CONTROLLED_INPUT_CLASSNAME}`
export const SWITCH_KEYBOARD_ID = "switch-greek-input"
export const CSS_INPUT_STYLE = "form-control"


// selectorName represents the selector to get the inputs for binding or
// unbinding
function setupKeyboardSwitchBtn(selectorName) {
    const switchGreekInput = document.getElementById(SWITCH_KEYBOARD_ID)

    switchGreekInput.addEventListener("click", () => {
        let greekOn = switchGreekInput.checked

        const keyboardButtons = document.querySelectorAll(".keyboard button")

        if (greekOn) {
            bindKeyboard(selectorName)
            keyboardButtons.forEach(b => b.disabled = false)
        } else {
            unbindKeyboard(selectorName)
            keyboardButtons.forEach(b => b.disabled = true)
        }
    })
}


function bindKeyboard(selectorName) {
    document.querySelectorAll(selectorName).forEach(inputSelected => bindInput(inputSelected))
}

function unbindKeyboard(selectorName) {
    document.querySelectorAll(selectorName).forEach(inputSelected => unbindInput(inputSelected))
}


function replaceInputPrefix(inputElement, newPrefix) {
    // Replace __prefix__ in the name and id attributes
    const newName = inputElement.name.replace('__prefix__', newPrefix);
    const newId = inputElement.id.replace('__prefix__', newPrefix);

    // Set the new values back to the input element
    inputElement.name = newName;
    inputElement.id = newId;
}

// function to use in case of changing attributes for forms below the one
// removed
function replaceCounterPrefix(inputElement, counter) {
    // Replace __prefix__ in the name and id attributes
    const newName = inputElement.name.replace(/-\d+-/, `-${counter}-`);
    const newId = inputElement.id.replace(/-\d+-/, `-${counter}-`);

    // Set the new values back to the input element
    inputElement.name = newName;
    inputElement.id = newId;
}

function updateInputsPrefix(newPrefix, ...inputs) {
    for (let inp of inputs) {
        replaceInputPrefix(inp, newPrefix)
    }
}

function updateInputsCounter(newCounter, ...inputs) {
    for (let inp of inputs) {
        replaceCounterPrefix(inp, newCounter)
    }
}

function bindNewInputs(...newInputs) {
    for (let newInput of newInputs) {
        newInput.classList.add(CONTROLLED_INPUT_CLASSNAME)
        newInput.classList.add(CSS_INPUT_STYLE)

        const gs = document.getElementById(SWITCH_KEYBOARD_ID)
        if (gs.checked) {
            bindInput(newInput)
        }
    }
}

function addRemoveListenerForInitialForms(removeBtnSelector, extraFormNodes,
                                          totalForms, initialForms, container,
                                          removeForm) {
    // update the extra forms delivered by django
    document.addEventListener("DOMContentLoaded", (e) => {
        const firstExtraNodeIdx = parseInt(initialForms.value)

        for (let i = firstExtraNodeIdx; i < parseInt(totalForms.value); i++) {
            const extraNode = container.children[i]
            const removeBtn = removeBtnSelector(extraNode.children)

            removeBtn.addEventListener("click", removeForm)
            extraFormNodes.push(extraNode)
        }
    })
}

export {
    setupKeyboardSwitchBtn, replaceInputPrefix, replaceCounterPrefix,
    updateInputsPrefix, updateInputsCounter, bindNewInputs, addRemoveListenerForInitialForms
}
