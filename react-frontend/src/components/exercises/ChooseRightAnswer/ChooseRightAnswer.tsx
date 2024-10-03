import {
  Box,
  Stack,  
  Button,
  Typography,
} from "@mui/material";

import {
  SubmissionAction,
  bgSubmitBtn,
  bgHoverSubmitBtn,
} from "src/utils";

import QueryStatement from "src/components/exercises/QueryStatement";
import ImageBox from "src/components/exercises/ImageBox";

import { useState } from "react";

import "./ChooseRightAnswer.css";

const palette = {
  active: "#ffe9ce",
  correctChoice: "#ffe9ce",
  wrongChoice: "#ffe9ce",
  background: {
    active: "#3777ff",
    correctChoice: "#228b22",
    wrongChoice: "#CE2029",
  },
  border: {
    correctAnswer: "#5A9D30",
  },
  disabled: {
    unselected: "#0f3a96",
    correctChoice: "#ffe9ce",
    wrongChoice: "#ffe9ce",
  },
};

interface AnswerChoice {
  text: string;
  isCorrect: boolean;
}

interface ChooseRightAnswerProps {
  question: string;
  answerChoices: AnswerChoice[];
  multiChoice: boolean;
  imageUrl?: string;
  audioUrl?: string;
  notifySubmission: SubmissionAction;
}

function ChooseRightAnswer(props: ChooseRightAnswerProps) {
  const {
    question,
    answerChoices,
    multiChoice,
    imageUrl,
    audioUrl,
    notifySubmission,
  } = props;

  const initialState = Array.from(
    { length: answerChoices.length },
    (_, idx) => ({ selected: false, index: idx, result: null })
  );

  const [answerButtons, setAnswerButtons] = useState<
    {
      selected: boolean;
      index: number;
      result: boolean | null;
    }[]
  >(initialState);

  const [submitted, setSubmitted] = useState(false);
  const [allAnswersCorrect, setAllAnswersCorrect] = useState(true);

  function handleSelect(index: number) {
    setAnswerButtons((prevAnswerButtons) =>
      prevAnswerButtons.map((button, idx) =>
        idx === index
          ? { ...button, selected: !button.selected }
          : multiChoice
          ? button
          : { ...button, selected: false }
      )
    );
  }

  function handleSubmit() {
    const selectedChoices = answerButtons.filter((b: any) => b.selected);
    // for emphasizing choices color based on correctness
    const newAnswerButtons = [...answerButtons];

    let allCorrect = selectedChoices.length > 0;

    for (const selected of selectedChoices) {
      newAnswerButtons[selected.index].result =
        answerChoices[selected.index].isCorrect;

      if (!answerChoices[selected.index].isCorrect) {
        allCorrect = false;
      }
    }

    if (allCorrect) {
      const selectedTexts = selectedChoices.map(
        (choiceBtn: any) => answerChoices[choiceBtn.index].text
      );

      allCorrect = answerChoices
        .filter((choice: AnswerChoice) => choice.isCorrect)
        .map((choice: AnswerChoice) => choice.text)
        .every((choiceText: string) => selectedTexts.includes(choiceText));
    }

    setAllAnswersCorrect(allCorrect);

    setAnswerButtons(() => newAnswerButtons);

    setSubmitted(() => true);
    notifySubmission(allCorrect);
  }

  function getAnswerChoiceBtnBgColor(idx: number) {
    return submitted
      ? answerButtons[idx].selected
        ? answerChoices[idx].isCorrect
          ? palette.background.correctChoice
          : palette.background.wrongChoice
        : ""
      : answerButtons[idx].selected
      ? palette.background.active
      : "";
  }

  function getAnswerChoiceBtnHoverColors(idx: number) {
    return {
      backgroundColor: !submitted
        ? answerButtons[idx].selected
          ? palette.background.active
          : ""
        : "",
    };
  }

  function getAnswerChoiceBtnDisabledColors(idx: number) {
    return {
      color: answerButtons[idx].selected
        ? answerChoices[idx].isCorrect
          ? palette.disabled.correctChoice
          : palette.disabled.wrongChoice
        : palette.disabled.unselected,
      borderColor: submitted
        ? answerChoices[idx].isCorrect
          ? palette.border.correctAnswer
          : ""
        : "",
      borderWidth:
        !answerButtons[idx].selected && answerChoices[idx].isCorrect
          ? "5px"
          : "",
    };
  }

  return (
    <Box
      mx={1}
      mb={1}
      className="d-flex flex-column flex-sm-row gap-3 justify-content-sm-center align-items-sm-center"
    >
      <Stack mb={3} gap={2}>
        <QueryStatement text={question} />
        {imageUrl && <ImageBox imageUrl={imageUrl} />}
        {audioUrl && <audio controls className="rounded p-2 w-100" autoPlay>
          <source src={audioUrl} type="audio/mp3" />
          <source src={audioUrl} type="audio/wav" />
          <source src={audioUrl} type="audio/ogg" />
          Your browser does not support the audio element.
        </audio>}
      </Stack>

      <Stack
        spacing={1}
        direction="column"
        useFlexGap
        sx={{
          width: {
            xs: "100%",
            sm: 300,
            lg: 400,
          },
          justifyContent: "start",
          justifyItems: "start",
          alignContent: "start",
        }}
      >
        {answerChoices.map((answer: any, idx: number) => (
          <Button
            key={idx}
            disabled={submitted}
            sx={{
              textTransform: "none",
              paddingY: 2,
              fontSize: "1.4rem",
              backgroundColor: getAnswerChoiceBtnBgColor(idx),
              "&:hover": getAnswerChoiceBtnHoverColors(idx),
              "&.Mui-disabled": getAnswerChoiceBtnDisabledColors(idx),
              color: answerButtons[idx].selected ? palette.active : "",
              transition: "0.05s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            disableTouchRipple
            variant="outlined"
            onClick={() => handleSelect(idx)}
          >
            <Typography
              noWrap={false}
              align="center"
              sx={{
                fontSize: "1.4rem",
                whiteSpace: "normal",
                wordBreak: "break-word",
                hyphens: "auto",
                textAlign: "center",
              }}
            >
              {answer.text}
            </Typography>
          </Button>
        ))}

        {!submitted && (
          <Button
            type="submit"
            variant="contained"
            sx={{
              mt: 3,
              backgroundColor: bgSubmitBtn,
              "&:hover": {
                backgroundColor: bgHoverSubmitBtn,
              },
            }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        )}
        {submitted && (
          <Box
            sx={{
              padding: "10px",
              fontSize: "1.2rem",
              color: allAnswersCorrect ? "green" : "red",
              textAlign: "center",
            }}
          >
            {allAnswersCorrect ? "Very well" : "Try again next time!"}
          </Box>
        )}
      </Stack>
    </Box>
  );
}

export default ChooseRightAnswer;
