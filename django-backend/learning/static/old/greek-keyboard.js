import {
    greek2htmlCode, greekAlphabet, initGreekAlphabet, lettersNamesMap,
    keyLetterMap
} from "./greek-constants.js"


import {
    specialSetLowercase,
    specialSetUppercase,
} from "./greek-constants.js"

import {
    alphaSpecialsLowercase,
    epsilonSpecialsLowercase,
    etaSpecialLowercase,
    iotaSpecialLowercase,
    omicronSpecialLowercase,
    omegaSpecialLowercase,
    upsilonSpecialLowercase,
    rhoSpecialLowercase,
    alphaSpecialsUppercase,
    epsilonSpecialsUppercase,
    etaSpecialUppercase,
    iotaSpecialUppercase,
    omicronSpecialUppercase,
    omegaSpecialUppercase,
    upsilonSpecialUppercase,
    rhoSpecialUppercase,
} from './greek-constants.js';

initGreekAlphabet()




var inputDiv = document.getElementById('kb-greek-input')

const SPACE_BTN = 'kb-space-btn'
const CASE_BTN = 'kb-case-btn'
const BACKSPACE_BTN = 'kb-backspace-btn'
const DEL_ALL_BTN = 'kb-del-all-btn'
const EXTRA_CHARS_BTN = 'kb-extra-box-btn'
const EXTRA_BOX_ID = 'kb-extra-box'

const KEYBD_BTNS_CLASS = 'kb-key-btn'
const EXTRA_BOX_CLASS = 'kb-extra-box'
const EXTRA_BOX_ROW_CLASS = 'kb-extra-div'


function insertTextToInput(text) {
    var cursorPos = inputDiv.selectionStart
    var prevVal = inputDiv.value

    inputDiv.value = prevVal.slice(0, cursorPos)
                    + text
                    + prevVal.slice(cursorPos)

    inputDiv.setSelectionRange(cursorPos + text.length, cursorPos + text.length)
    inputDiv.focus()
}

// write using keyboard buttons

Array.from(document.getElementsByClassName(KEYBD_BTNS_CLASS)).forEach(btn =>
    btn.addEventListener('click', () => insertTextToInput(btn.innerHTML))
);

document.getElementById(SPACE_BTN).onclick = () => insertTextToInput(' ')

const vowelSpecials = {
    'a': 'άὰᾶ',
    'e': 'έὲ',
    'h': 'ήὴῆ',
    'i': 'ίὶῖ',
    'o': 'όὸ',
    'w': 'ώὼῶ',
    'u': 'ύὺῦ',

    'A': 'ΆᾺ',
    'E': 'ΈῈ',
    'H': 'ΉῊ',
    'I': 'ΊῚ',
    'O': 'ΌῸ',
    'W': 'ΏῺ',
    'U': 'ΎῪ',
}


const pressedKeys = {}

inputDiv.addEventListener('keydown', (e) => {
    pressedKeys[e.key] = true
})
inputDiv.addEventListener('keyup', (e) => {
    pressedKeys[e.key] = false
})

// write also using physical keyboard

inputDiv.addEventListener('keydown', (e) => {

    let prevVal = inputDiv.value
    const position = inputDiv.selectionStart

    const keys = Object.keys(keyLetterMap)

    if (e.altKey) {
        // acute accent
        if (pressedKeys['/'] && (e.key in vowelSpecials)) {
            e.preventDefault()
            insertTextToInput(vowelSpecials[e.key][0])
        }

        // grave accent
        if (pressedKeys['\\'] && (e.key in vowelSpecials)) {
            e.preventDefault()
            insertTextToInput(vowelSpecials[e.key][1])
        }

        // circumflex accent
        if (pressedKeys["`"] && (e.key in vowelSpecials)) {
            e.preventDefault()

            if (vowelSpecials[e.key].length > 2) {
                insertTextToInput(vowelSpecials[e.key][2])
            }
        }

    } else if (e.ctrlKey) {
        if (e.key == 'c') {
            e.preventDefault()

            var selectedText = inputDiv.value.substring(inputDiv.selectionStart,
                                    inputDiv.selectionEnd)

            // Use Clipboard API to copy the selected text to the clipboard
            navigator.clipboard.writeText(selectedText)
        } else if (e.key == 'v') {
            e.preventDefault();

            // Use Clipboard API to read text from the clipboard
            navigator.clipboard.readText().then(function (clipboardText) {
                insertTextToInput(clipboardText)
            }).catch(function (err) {
                console.error('Unable to paste text: ', err);
            });
        }
    } else if (keys.includes(e.key)) {
        e.preventDefault()

        inputDiv.value = prevVal.slice(0, position)
            + greekAlphabet[keyLetterMap[e.key]]
            + prevVal.slice(position)

        inputDiv.setSelectionRange(position + 1, position + 1)
    }
})


document.getElementById(BACKSPACE_BTN).addEventListener('click', () => {
    var cursorPos = inputDiv.selectionStart;
    var prevVal = inputDiv.value;

    inputDiv.value = prevVal.slice(0, cursorPos - 1) + prevVal.slice(cursorPos)

    // Move the cursor after the inserted character
    inputDiv.setSelectionRange(cursorPos - 1, cursorPos - 1)
    inputDiv.focus()
})



document.getElementById(DEL_ALL_BTN).addEventListener('click', () => {
    inputDiv.value = ''
})


function initExtraBox(charCase) {
    const extraBox = document.createElement('div')
    extraBox.className = EXTRA_BOX_CLASS

    let sets

    if (charCase === 'lower') {
        sets = specialSetLowercase
    } else if (charCase === 'upper') {
        sets = specialSetUppercase
    } else {
        console.log(`undefined ${charCase} argument`);
    }

    for (let set of sets) {
        let btnsBox = document.createElement('div')
        btnsBox.className = EXTRA_BOX_ROW_CLASS

        for (let c of set) {
            let btn = document.createElement('button')

            btn.className = KEYBD_BTNS_CLASS
            btn.innerHTML = c
            btn.type = 'button'
            btn.addEventListener('click', () => insertTextToInput(btn.innerHTML))
            btnsBox.appendChild(btn)
        }

        extraBox.append(btnsBox)
    }

    return extraBox
}



const extraBoxLower = initExtraBox('lower')
const extraBoxUpper = initExtraBox('upper')


let displayExtra = false
let uppercase = false
let isLongPressing = false;

document.getElementById(CASE_BTN).addEventListener('click', () => {
    uppercase = !uppercase

    for (let name in lettersNamesMap) {
        const letter = lettersNamesMap[name][uppercase ? 1 : 0]

        document.getElementById(name).innerHTML = greek2htmlCode[letter]
    }

    if (!displayExtra) {
        return
    }

    const extraBox = document.getElementById(EXTRA_BOX_ID)

    extraBox.innerHTML = ''
    extraBox.append(uppercase ? extraBoxUpper : extraBoxLower)

    if (isLongPressing) {
        updateExtraCharBox()
    }
})

const extendBtn = document.getElementById(EXTRA_CHARS_BTN)

extendBtn.addEventListener('click', () => {
    displayExtra = !displayExtra
    extendBtn.innerText = displayExtra ? 'Collapse ⬆' : 'Expand ⬇'

    const extraBox = document.getElementById(EXTRA_BOX_ID)

    if (displayExtra) {
        extraBox.append(uppercase ? extraBoxUpper : extraBoxLower)
    } else {
        extraBox.innerHTML = ''
    }
})

const extraCharBox = document.getElementById('extra-click-box');

// Track the current selected character
let selectedCharacter = null
let keyPressed = null

// Show the extra character box and start long-pressing when the key is held down
document.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('kb-key-btn')) {
        isLongPressing = true;
        keyPressed = e.target.id;

        updateExtraCharBox()
        extraCharBox.style.display = 'flex'
        extraCharBox.style.flexWrap = 'wrap'

        // Position the extra character box based on the button's position
        extraCharBox.style.left = e.target.offsetLeft + 'px';
        extraCharBox.style.top = (e.target.offsetTop + e.target.offsetHeight) + 'px';
    }
});

// Update the selected character when moving the mouse over the extra character box
extraCharBox.addEventListener('mousemove', (e) => {
    if (isLongPressing) {
        const hoveredBtn = e.target.closest('.extra-click-btn');
        if (hoveredBtn) {
            selectedCharacter = hoveredBtn.innerText;
        }
    }
});

// Insert the selected character when the mouse is released
document.addEventListener('mouseup', () => {
    if (isLongPressing) {
        isLongPressing = false;
        if (selectedCharacter) {
            // Insert the selected character into the input
            insertTextToInput(selectedCharacter);
        }
        extraCharBox.style.display = 'none';
        selectedCharacter = null;
    }
});


function updateExtraCharBox() {
    let specialChars
    extraCharBox.replaceChildren()

    switch (keyPressed) {
        case 'alpha':
            specialChars = uppercase ? alphaSpecialsUppercase : alphaSpecialsLowercase
            break
        case 'epsilon':
            specialChars = uppercase ? epsilonSpecialsUppercase : epsilonSpecialsLowercase
            break
        case 'eta':
            specialChars = uppercase ? etaSpecialUppercase : etaSpecialLowercase
            break
        case 'iota':
            specialChars = uppercase ? iotaSpecialUppercase : iotaSpecialLowercase
            break
        case 'omicron':
            specialChars = uppercase ? omicronSpecialUppercase : omicronSpecialLowercase
            break
        case 'omega':
            specialChars = uppercase ? omegaSpecialUppercase : omegaSpecialLowercase
            break
        case 'y':
        case 'upsilon':
            specialChars = uppercase ? upsilonSpecialUppercase : upsilonSpecialLowercase
            break
        case 'rho':
            specialChars = uppercase ? rhoSpecialUppercase : rhoSpecialLowercase
            break
        default:
            break
    }

    specialChars.split('').forEach(char => {
        const btn = document.createElement('button')
        btn.type = 'button'
        btn.className = 'extra-click-btn'
        btn.innerHTML = char
        extraCharBox.appendChild(btn)
    });
}
