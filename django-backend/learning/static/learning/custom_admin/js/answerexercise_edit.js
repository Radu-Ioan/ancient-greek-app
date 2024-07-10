import {bindInput} from './greek-keyboard-inline.js'
import {
    setupKeyboardSwitchBtn,
} from "./custom_edit_utils.js";
import {
    CONTROLLED_INPUT_SELECTOR,
} from "./custom_edit_utils.js";

setupKeyboardSwitchBtn(CONTROLLED_INPUT_SELECTOR)

const inputs = document.querySelectorAll(CONTROLLED_INPUT_SELECTOR)
inputs.forEach(inp => bindInput(inp))
