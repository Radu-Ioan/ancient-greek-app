import { useEffect } from "react";
import { setupKeyboard } from "../../utils/greek-keyboard";

import GreekButtonsBox from "./GreekButtonsBox";

const GreekKeyboard = () => {
  useEffect(() => {
    setupKeyboard();
  }, []);

  return <GreekButtonsBox />;
};

export default GreekKeyboard;
