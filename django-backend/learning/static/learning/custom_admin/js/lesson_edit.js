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

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.add-exercise').forEach(function (element) {
        element.addEventListener('click', function (event) {
            event.preventDefault();
            document.getElementById('exercise_type').value = this.getAttribute('data-exercise-type');
            document.getElementById('id_lesson_form').submit();
        });
    });
});