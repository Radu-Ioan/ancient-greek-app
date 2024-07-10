import React, { useState, useMemo, useEffect } from "react";

import GreekKeyboard from "src/components/GreekKeyboard";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

import { bindInput, unbindInput } from "src/utils/greek-keyboard";
import { CenteringBox, SubmissionAction } from "src/utils";
import { Button, Container, Paper, Typography } from "@mui/material";
import { bgSubmitBtn, bgHoverSubmitBtn } from "src/utils";

import QueryStatement from "src/components/exercises/QueryStatement";

import "./CompleteExercise.css";
import "bootstrap/dist/css/bootstrap.min.css";

interface CompleteExerciseItem {
  text: string;
  hidden: boolean;
}

interface CompleteExerciseProps {
  query: string;
  textItems: CompleteExerciseItem[];
  notifySubmission: SubmissionAction;
}

function validate(correctAnswers: any, setResult: any) {
  const userAnswers: any = {};

  for (const answer in correctAnswers) {
    const completedInput = document.getElementById(
      `id_${answer}`
    ) as HTMLInputElement;

    if (!completedInput) {
      continue;
    }

    userAnswers[answer] = completedInput.value;
  }

  const result: any = {};

  let allGood = Object.keys(userAnswers).length > 0;
  console.log("correct answers:", correctAnswers);
  console.log("completed inputs:", userAnswers);

  for (let key in userAnswers) {
    if (userAnswers[key].trim() !== correctAnswers[key].trim()) {
      result[key] = false;
      allGood = false;
      console.log("all good set to false");
    } else {
      result[key] = true;
    }
  }

  if (allGood) {
    result["message"] = "Very well!";
  } else {
    result["message"] = "Try again next time";
  }

  result["all-correct"] = allGood;

  setResult(result);

  return allGood;
}

function handleSubmit(
  correctAnswers: any,
  setResult: any,
  setSubmitted: any,
  notifySubmission: SubmissionAction
) {
  const allGood = validate(correctAnswers, setResult);
  setSubmitted(() => true);
  notifySubmission(allGood);
}

function renderCorrectAnswer(textItems: CompleteExerciseItem[]) {
  return (
    <>
      <label>Correct answer:</label>
      <div className="d-flex flex-wrap gap-1 correct-answer-size mui-font justify-content-center">
        {textItems.map((ans, idx) => (
          <div key={idx} className={ans.hidden ? "bold-font" : ""}>
            {ans.text}
          </div>
        ))}
      </div>
    </>
  );
}

function getUserInputs(correctAnswers: any) {
  const userInputs: any = {};

  for (const answer in correctAnswers) {
    const userInput = document.getElementById(
      `id_${answer}`
    ) as HTMLInputElement;

    if (!userInput) {
      continue;
    }

    userInputs[answer] = userInput;
  }

  return userInputs;
}

function CompleteExercise(props: CompleteExerciseProps) {
  const { query, textItems, notifySubmission } = props;
  const [result, setResult] = useState<any>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [greekOn, setGreekOn] = useState<boolean>(true);

  const correctAnswers = useMemo(() => {
    let correctAnswers: any = {};

    for (const [idx, exercise] of textItems.entries()) {
      if (exercise.hidden) {
        correctAnswers[`input_${idx}`] = exercise.text;
      }
    }

    return correctAnswers;
  }, [textItems]);

  function handleGreekSwitch(event: React.ChangeEvent<HTMLInputElement>) {
    const userInputs = getUserInputs(correctAnswers);

    if (greekOn) {
      // now the switch is gonna be turned to normal keyboard
      Object.values(userInputs).forEach((inp) =>
        unbindInput(inp as HTMLInputElement)
      );
    } else {
      Object.values(userInputs).forEach((inp) =>
        bindInput(inp as HTMLInputElement)
      );
    }
    setGreekOn(() => event.target.checked);
  }

  useEffect(() => {
    const inputsToComplete = textItems.reduce((acc: any, item, idx) => {
      if (item.hidden) {
        acc.push({ index: idx, text: item.text });
      }
      return acc;
    }, []);

    for (const inp of inputsToComplete) {
      const inputElement = document.getElementById(`id_input_${inp.index}`);

      if (inputElement) {
        bindInput(inputElement as HTMLInputElement);
      }
    }
  }, []);

  return (
    <div className="container-fluid d-flex flex-column gap-2">
      <CenteringBox>
        <QueryStatement text={query} />
      </CenteringBox>
      <div className="d-flex flex-wrap justify-content-center">
        {textItems.map((item, index) => (
          <div key={index} className="m-2">
            {item.hidden ? (
              <input
                type="text"
                className={`form-control mb-2 input-style ${
                  result
                    ? result[`input_${index}`]
                      ? "correct-border"
                      : "wrong-border"
                    : ""
                } ${submitted && "disabled-input"} mui-font`}
                name={`input_${index}`}
                id={`id_input_${index}`}
                disabled={submitted}
              />
            ) : (
              <p className="lead mb-2 mui-font">{item.text}</p>
            )}
          </div>
        ))}
      </div>
      <div className="d-flex flex-column align-items-center gap-2">
        {!submitted && greekOn && <GreekKeyboard />}
        {!submitted && (
          <FormControlLabel
            labelPlacement="start"
            control={
              <Switch
                checked={greekOn}
                onChange={handleGreekSwitch}
                inputProps={{ "aria-label": "controlled" }}
              />
            }
            label="Use greek keyboard"
          />
        )}

        {!submitted && (
          <Button
            id="submit-btn"
            sx={{
              color: "white",
              paddingX: 2,
              width: {
                xs: "100%",
                sm: "200px",
              },
              backgroundColor: bgSubmitBtn,
              "&:hover": {
                backgroundColor: bgHoverSubmitBtn,
              },
            }}
            onClick={() =>
              handleSubmit(
                correctAnswers,
                setResult,
                setSubmitted,
                notifySubmission
              )
            }>
            Submit
          </Button>
        )}

        {result !== null && (
          <Typography
            sx={{
              fontSize: "1.3rem",
              paddingX: "20px",
              paddingY: "10px",
              color: result["all-correct"] ? "green" : "red",
            }}>
            {result["message"]}
          </Typography>
        )}

        {submitted && !result["all-correct"] && renderCorrectAnswer(textItems)}
      </div>
    </div>
  );
}

export default CompleteExercise;
