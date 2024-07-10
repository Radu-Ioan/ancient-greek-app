import {
  greek2htmlCode,
  greekAlphabet,
  initGreekAlphabet,
  lettersNamesMap,
  keyLetterMap,
} from "./greek-constants";

import { specialSetLowercase, specialSetUppercase } from "./greek-constants";

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
} from "./greek-constants";

const SPACE_BTN = "kb-space-btn";
const CASE_BTN = "kb-case-btn";
const BACKSPACE_BTN = "kb-backspace-btn";
const DEL_ALL_BTN = "kb-del-all-btn";
const EXTRA_CHARS_BTN = "kb-extra-box-btn";
const EXTRA_BOX_ID = "kb-extra-box";

const KEYBD_BTNS_CLASS = "kb-key-btn";
const EXTRA_BOX_CLASS = "kb-extra-box";
const EXTRA_BOX_ROW_CLASS = "kb-extra-div";

let inputDiv: any = null;

function insertTextToInput(text: string) {
  if (!inputDiv) {
    console.log("No input focused");
    return;
  }

  let cursorPos = inputDiv.selectionStart;
  let prevVal = inputDiv.value;

  inputDiv.value =
    prevVal.slice(0, cursorPos) + text + prevVal.slice(cursorPos);

  inputDiv.setSelectionRange(cursorPos + text.length, cursorPos + text.length);
  inputDiv.focus();
}

function initSpaceBtn() {
  const spaceBtn = document.getElementById(SPACE_BTN);

  if (spaceBtn) {
    spaceBtn.onclick = () => insertTextToInput(" ");
  }
}

const vowelSpecials: any = {
  a: "άὰᾶ",
  e: "έὲ",
  h: "ήὴῆ",
  i: "ίὶῖ",
  o: "όὸ",
  w: "ώὼῶ",
  u: "ύὺῦ",

  A: "ΆᾺ",
  E: "ΈῈ",
  H: "ΉῊ",
  I: "ΊῚ",
  O: "ΌῸ",
  W: "ΏῺ",
  U: "ΎῪ",
};

const pressedKeys: any = {};

function markPressed(e: any) {
  pressedKeys[e.key] = true;
}

function markUnpressed(e: any) {
  pressedKeys[e.key] = false;
}

function setTarget(e: any) {
  inputDiv = e.target;
}

function writeWithPhysicalKeyboard(e: any) {
  let prevVal = inputDiv.value;
  const position = inputDiv.selectionStart;

  const keys = Object.keys(keyLetterMap);

  if (e.altKey) {
    // acute accent
    if (pressedKeys["/"] && e.key in vowelSpecials) {
      e.preventDefault();
      insertTextToInput(vowelSpecials[e.key][0]);
    }

    // grave accent
    if (pressedKeys["\\"] && e.key in vowelSpecials) {
      e.preventDefault();
      insertTextToInput(vowelSpecials[e.key][1]);
    }

    // circumflex accent
    if (pressedKeys["`"] && e.key in vowelSpecials) {
      e.preventDefault();

      if (vowelSpecials[e.key].length > 2) {
        insertTextToInput(vowelSpecials[e.key][2]);
      }
    }
  } else if (e.ctrlKey) {
    if (e.key == "c") {
      e.preventDefault();

      var selectedText = inputDiv.value.substring(
        inputDiv.selectionStart,
        inputDiv.selectionEnd
      );

      // Use Clipboard API to copy the selected text to the clipboard
      navigator.clipboard.writeText(selectedText);
    } else if (e.key == "v") {
      e.preventDefault();

      // Use Clipboard API to read text from the clipboard
      navigator.clipboard
        .readText()
        .then(function (clipboardText) {
          insertTextToInput(clipboardText);
        })
        .catch(function (err) {
          console.error("Unable to paste text: ", err);
        });
    }
  } else if (keys.includes(e.key)) {
    e.preventDefault();

    inputDiv.value =
      prevVal.slice(0, position) +
      greekAlphabet[keyLetterMap[e.key]] +
      prevVal.slice(position);

    inputDiv.setSelectionRange(position + 1, position + 1);
  }
}

function bindInput(inp: HTMLInputElement) {
  inp.addEventListener("keydown", markPressed);
  inp.addEventListener("keyup", markUnpressed);
  inp.addEventListener("focus", setTarget);
  inp.addEventListener("keydown", writeWithPhysicalKeyboard);
}

function unbindInput(inp: HTMLInputElement) {
  inp.removeEventListener("keydown", markPressed);
  inp.removeEventListener("keyup", markUnpressed);
  inp.removeEventListener("focus", setTarget);
  inp.removeEventListener("keydown", writeWithPhysicalKeyboard);
}

function setInputNull() {
  inputDiv = null;
}

function setUpBackspaceBtn() {
  const backspaceBtn = document.getElementById(BACKSPACE_BTN);

  if (!backspaceBtn) {
    console.log("No backspace btn found");
    return;
  }

  backspaceBtn.addEventListener("click", () => {
    let cursorPos = inputDiv.selectionStart;
    let prevVal = inputDiv.value;

    inputDiv.value = prevVal.slice(0, cursorPos - 1) + prevVal.slice(cursorPos);

    // Move the cursor after the inserted character
    inputDiv.setSelectionRange(cursorPos - 1, cursorPos - 1);
    inputDiv.focus();
  });
}

function setUpDelBtn() {
  const deleteAllBtn = document.getElementById(DEL_ALL_BTN);
  if (!deleteAllBtn) {
    return;
  }
  deleteAllBtn.addEventListener("click", () => {
    inputDiv.value = "";
  });
}

function initExtraBox(charCase: string) {
  const extraBox = document.createElement("div");
  extraBox.className = EXTRA_BOX_CLASS;

  let sets: any[] = [];

  if (charCase === "lower") {
    sets = specialSetLowercase;
  } else if (charCase === "upper") {
    sets = specialSetUppercase;
  } else {
    console.log(`undefined ${charCase} argument`);
  }

  for (let set of sets) {
    let btnsBox = document.createElement("div");
    btnsBox.className = EXTRA_BOX_ROW_CLASS;

    for (let c of set) {
      let btn = document.createElement("button");

      btn.className = KEYBD_BTNS_CLASS;
      btn.innerHTML = c;
      btn.type = "button";
      btn.addEventListener("click", () => insertTextToInput(btn.innerHTML));
      btnsBox.appendChild(btn);
    }

    extraBox.append(btnsBox);
  }

  return extraBox;
}

let extraBoxLower: any = null;
let extraBoxUpper: any = null;

function initExtraBoxes() {
  extraBoxLower = initExtraBox("lower");
  extraBoxUpper = initExtraBox("upper");
}

let displayExtra = false;
let uppercase = false;
let isLongPressing = false;

function setUpCaseBtn() {
  const caseBtn = document.getElementById(CASE_BTN);

  if (!caseBtn) {
    console.log("No case btn found!");
    return;
  }

  caseBtn.addEventListener("click", () => {
    uppercase = !uppercase;

    for (let name in lettersNamesMap) {
      const letter = lettersNamesMap[name][uppercase ? 1 : 0];

      const letterElement = document.getElementById(name);

      if (letterElement) {
        letterElement.innerHTML = greek2htmlCode[letter];
      }
    }

    if (!displayExtra) {
      return;
    }

    const extraBox = document.getElementById(EXTRA_BOX_ID);

    if (extraBox) {
      extraBox.innerHTML = "";
      extraBox.append(uppercase ? extraBoxUpper : extraBoxLower);
    }

    if (isLongPressing) {
      updateExtraCharBox();
    }
  });
}

function setUpExtendBtn() {
  const extendBtn = document.getElementById(EXTRA_CHARS_BTN);

  if (!extendBtn) {
    console.log("No extend btn found");

    return;
  }

  extendBtn.addEventListener("click", () => {
    displayExtra = !displayExtra;
    extendBtn.innerText = displayExtra ? "Collapse ⬆" : "Expand ⬇";

    const extraBox = document.getElementById(EXTRA_BOX_ID);

    if (!extraBox) {
      return;
    }

    if (displayExtra) {
      extraBox.append(uppercase ? extraBoxUpper : extraBoxLower);
    } else {
      extraBox.innerHTML = "";
    }
  });
}

let extraCharBox: any = document.getElementById("extra-click-box");
function initExtraCharBox() {
  extraCharBox = document.getElementById("extra-click-box");
}

// Track the current selected character
let selectedCharacter: string | null = null;
let keyPressed: string | null = null;

function setUpMousedownEvent() {
  // Show the extra character box and start long-pressing when the key is held down
  document.addEventListener("mousedown", (e: any) => {
    if (
      extraCharBox == null ||
      e.target == null ||
      e.target.classList == null
    ) {
      return;
    }

    if (e.target.classList.contains("kb-key-btn")) {
      isLongPressing = true;
      keyPressed = e.target.id;

      updateExtraCharBox();
      extraCharBox.style.display = "flex";
      extraCharBox.style.flexWrap = "wrap";

      // Position the extra character box based on the button's position
      extraCharBox.style.left = e.target.offsetLeft + "px";
      extraCharBox.style.top =
        e.target.offsetTop + e.target.offsetHeight + "px";
    }
  });
}

function setUpMousemoveEvent() {
  if (!extraCharBox) {
    return;
  }

  // Update the selected character when moving the mouse over the extra character box
  extraCharBox.addEventListener("mousemove", (e: any) => {
    if (!e.target || !e.target.closest) {
      return;
    }

    if (isLongPressing) {
      const hoveredBtn = e.target.closest(".extra-click-btn");
      if (hoveredBtn) {
        selectedCharacter = hoveredBtn.innerText;
      }
    }
  });
}

function setUpMouseupEvent() {
  // Insert the selected character when the mouse is released
  document.addEventListener("mouseup", () => {
    if (isLongPressing) {
      isLongPressing = false;
      if (selectedCharacter) {
        // Insert the selected character into the input
        insertTextToInput(selectedCharacter);
      }
      if (extraCharBox) {
        extraCharBox.style.display = "none";
      }
      selectedCharacter = null;
    }
  });
}

function updateExtraCharBox() {
  if (!extraCharBox) {
    return;
  }

  let specialChars = null;

  extraCharBox.replaceChildren();

  switch (keyPressed) {
    case "alpha":
      specialChars = uppercase
        ? alphaSpecialsUppercase
        : alphaSpecialsLowercase;
      break;
    case "epsilon":
      specialChars = uppercase
        ? epsilonSpecialsUppercase
        : epsilonSpecialsLowercase;
      break;
    case "eta":
      specialChars = uppercase ? etaSpecialUppercase : etaSpecialLowercase;
      break;
    case "iota":
      specialChars = uppercase ? iotaSpecialUppercase : iotaSpecialLowercase;
      break;
    case "omicron":
      specialChars = uppercase
        ? omicronSpecialUppercase
        : omicronSpecialLowercase;
      break;
    case "omega":
      specialChars = uppercase ? omegaSpecialUppercase : omegaSpecialLowercase;
      break;
    case "y":
    case "upsilon":
      specialChars = uppercase
        ? upsilonSpecialUppercase
        : upsilonSpecialLowercase;
      break;
    case "rho":
      specialChars = uppercase ? rhoSpecialUppercase : rhoSpecialLowercase;
      break;
    default:
      break;
  }

  if (!specialChars) {
    return;
  }

  specialChars.split("").forEach((char) => {
    if (!extraCharBox) {
      return;
    }

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "extra-click-btn";
    btn.innerHTML = char;

    extraCharBox.appendChild(btn);
  });
}

function setupKeyboard() {
  initGreekAlphabet();
  initSpaceBtn();
  initExtraBoxes();
  initExtraCharBox();

  // write using keyboard buttons

  Array.from(document.getElementsByClassName(KEYBD_BTNS_CLASS)).forEach((btn) =>
    btn.addEventListener("click", () => insertTextToInput(btn.innerHTML))
  );

  setUpBackspaceBtn();
  setUpExtendBtn();
  setUpDelBtn();
  setUpCaseBtn();
  setUpMousedownEvent();
  setUpMousemoveEvent();
  setUpMouseupEvent();
}

export { bindInput, unbindInput, setInputNull, setupKeyboard };
