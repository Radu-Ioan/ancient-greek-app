import BackspaceIcon from '@mui/icons-material/Backspace';

import "bootstrap/dist/css/bootstrap.min.css";
import './GreekKeyboard.css';

const row1Letters = {
  sigma1: "ς",
  omega: "ω",
  epsilon: "ε",
  rho: "ρ",
  tau: "τ",
  upsilon: "υ",
  y: "υ",
  iota: "ι",
  omicron: "ο",
  pi: "π",
};

const row2Letters = {
  alpha: "α",
  sigma2: "σ",
  delta: "δ",
  phi: "φ",
  gamma: "γ",
  eta: "η",
  theta: "θ",
  kappa: "κ",
  lambda: "λ",
};

const row3Letters = {
  zeta: "ζ",
  xi: "ξ",
  chi: "χ",
  psi: "ψ",
  beta: "β",
  nu: "ν",
  mu: "μ",
};

const keyboardBtnBuilder = ([key, value]: any, idx: number) => (
  <button key={idx} type="button" id={key} className="kb-key-btn">
    {value}
  </button>
);

const GreekButtonsBox = () => {
  return (
    <div className="keybd-col">
      <div className="keyboard">
        <div className="kb-row-1">
          {Object.entries(row1Letters).map(keyboardBtnBuilder)}
        </div>
        <div className="kb-row-2">
          {Object.entries(row2Letters).map(keyboardBtnBuilder)}
        </div>
        <div className="kb-row-3">
          {Object.entries(row3Letters).map(keyboardBtnBuilder)}
        </div>
        <div className="kb-row-4">
          <button type="button" id="kb-case-btn" className="key-ctrl-btn">
            Aa &#8679;
          </button>
          <button
            type="button"
            id="kb-space-btn"
            className="kb-key-btn"></button>
          <button type="button" id="kb-backspace-btn" className="key-ctrl-btn">
            <BackspaceIcon />
          </button>
          <button type="button" id="kb-del-all-btn" className="key-ctrl-btn">
            &#10799;
          </button>
        </div>
        <div className="kb-row-5">
          <button type="button" id="kb-extra-box-btn" className="key-ctrl-btn">
            Extend ⬇
          </button>
        </div>

        <div id="kb-extra-box"></div>

        <div id="extra-click-box" className="extra-click-box"></div>
      </div>
    </div>
  );
};

export default GreekButtonsBox;
