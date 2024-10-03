import {
  Button,
  Stack,
  Container,
  Typography,
} from "@mui/material";
import { SubmissionAction } from "src/utils";
import QueryStatement from "src/components/exercises/QueryStatement";
import { useState, useEffect } from "react";

import { bindInput, unbindInput } from "src/utils/greek-keyboard";

import GreekKeyboard from "src/components/GreekKeyboard";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useMediaQuery } from "@mui/material";

import { bgSubmitBtn, bgHoverSubmitBtn } from "src/utils";

import "./AnswerExercise.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ImageBox from "src/components/exercises/ImageBox";

const palette = {
  border: {
    success: "2px solid green",
    error: "2px solid red",
  },
  background: {
    disabled: {
      success: "#98E96D",
      error: "#EC9191",
    },
  },
};

interface AnswerExerciseProps {
  question: string;
  rightAnswer: string;
  imageUrl?: string;
  audioUrl?: string;
  notifySubmission: SubmissionAction;
}

function renderCorrectAnswer(answer: string) {
  return (
    <>
      <label>Correct answer:</label>
      <Typography sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
        {answer}
      </Typography>
    </>
  );
}

function validate(correctAnswer: string, userAnswer: string): boolean {
  return correctAnswer.trim() === userAnswer.trim();
}

function handleSubmit(
  correctAnswer: string,
  setSubmitted: any,
  setAnsweredCorrect: any,
  notifySubmission: SubmissionAction
) {
  const textField = document.getElementById("id_answer") as HTMLInputElement;

  if (textField === null) {
    return;
  }

  console.log("user answer:", textField.value);

  setSubmitted(() => true);
  const isCorrect: boolean = validate(correctAnswer, textField.value);
  setAnsweredCorrect(() => isCorrect);
  notifySubmission(isCorrect);
}

function AnswerExercise(props: AnswerExerciseProps) {
  const { question, rightAnswer, imageUrl, audioUrl, notifySubmission }: any =
    props;
  console.log("answer props:", props);

  const [submitted, setSubmitted] = useState(false);
  const [greekOn, setGreekOn] = useState(true);
  const [answeredCorrect, setAnsweredCorrect] = useState(null);

  useEffect(() => {
    const inputElement = document.getElementById("id_answer");

    if (inputElement) {
      bindInput(inputElement as HTMLInputElement);
    }
  }, []);

  function handleGreekSwitch(event: React.ChangeEvent<HTMLInputElement>) {
    const userInput = document.getElementById("id_answer") as HTMLInputElement;

    if (greekOn) {
      // now the switch is gonna be turned to normal keyboard
      unbindInput(userInput);
    } else {
      bindInput(userInput);
    }

    setGreekOn(() => event.target.checked);
  }

  const isSmallScreen = useMediaQuery("(max-width: 500px)");

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: {
          xs: "start",
          sm: "center"
        },
        gap: 1,
      }}
    >
      <Stack mb={3}>
        <QueryStatement text={question} />
        {imageUrl && <ImageBox imageUrl={imageUrl}/>}
        {audioUrl && <audio controls className="rounded p-2" autoPlay>
          <source src={audioUrl} type="audio/mp3" />
          <source src={audioUrl} type="audio/wav" />
          <source src={audioUrl} type="audio/ogg" />
          Your browser does not support the audio element.
        </audio>}
      </Stack>
      <input
        id="id_answer"
        placeholder={!submitted ? "Type here..." : ""}
        name="answer"
        disabled={submitted}
        className="form-control text-center mui-font container"
        autoComplete="false"
        style={{
          width: isSmallScreen ? "100%" : "500px",
          fontSize: "1.3rem",
          border: submitted
            ? answeredCorrect
              ? palette.border.success
              : palette.border.error
            : "",
          backgroundColor: submitted
            ? answeredCorrect
              ? palette.background.disabled.success
              : palette.background.disabled.error
            : "",
        }}
      ></input>
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
              rightAnswer,
              setSubmitted,
              setAnsweredCorrect,
              notifySubmission
            )
          }
        >
          Submit
        </Button>
      )}

      {answeredCorrect !== null && (
        <Typography
          sx={{
            fontSize: "1.3rem",
            paddingX: "20px",
            paddingY: "10px",
            color: answeredCorrect ? "green" : "red",
            textAlign: "center",
          }}
        >
          {answeredCorrect ? "Very well" : "Try again next time"}
        </Typography>
      )}

      {submitted && !answeredCorrect && renderCorrectAnswer(rightAnswer)}
    </Container>
  );
}

export default AnswerExercise;
