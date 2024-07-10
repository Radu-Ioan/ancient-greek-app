import {bindInput, setInputNull, unbindInput} from "./greek-keyboard-inline.js";


const switchGreekInput = document.getElementById("switch-greek-input")
let greekOn = switchGreekInput.checked


switchGreekInput.addEventListener("click", () => {
    greekOn = !greekOn
    const keyboardButtons = document.querySelectorAll(".keyboard button")

    if (greekOn) {
        bindKeyboard()
        keyboardButtons.forEach(b => b.disabled = false)
    } else {
        unbindKeyboard()
        keyboardButtons.forEach(b => b.disabled = true)
    }
})

function bindKeyboard() {
    const allInputs = Array.from(document.querySelectorAll(".vTextField"))
    const shownInputs = allInputs.filter(inp => !inp.closest(".empty-form"))

    for (let i of shownInputs) {
        bindInput(i)
    }
}

function unbindKeyboard() {
    const allInputs = Array.from(document.querySelectorAll(".vTextField"))
    const shownInputs = allInputs.filter(inp => !inp.closest(".empty-form"))

    for (let i of shownInputs) {
        unbindInput(i)
    }
}


function waitForElement(selector) {
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            const element = document.querySelector(selector)
            if (element) {
                clearInterval(interval)
                resolve(element)
            }
        }, 500)
    })
}

function waitForElements(selector) {
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            const elements = document.querySelectorAll(selector)
            if (elements && elements.length > 0) {
                clearInterval(interval)
                resolve(elements)
            }
        }, 500)
    })
}


function addBindListenersForNewInputs(modelName) {
    waitForElement(".add-row").then((addRow) => {
        setInputNull()

        addRow.addEventListener("click", () => {
            const totalForms = document.querySelector(
                `#id_${modelName.toLowerCase()}_set-TOTAL_FORMS`
            )

            const formsSelector = `#id_${modelName.toLowerCase()}_set-TOTAL_FORMS`
            console.log("forms selector:", formsSelector)

            const rowCount = parseInt(totalForms.value)

            const newInputsSelector
                = `#${modelName.toLowerCase()}_set-${rowCount - 1}  .vTextField`

            console.log("newInputsSelector:", newInputsSelector)

            waitForElements(newInputsSelector).then((newInputs) => {
                newInputs.forEach((input) => {
                    if (greekOn) {
                        bindInput(input)
                    }
                })
            })
        })
    })
}



export {
    bindKeyboard, unbindKeyboard, waitForElement, waitForElements,
    addBindListenersForNewInputs
}
