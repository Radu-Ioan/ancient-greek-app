import { useState, useEffect } from "react";
import { useLoaderData, redirect, Link } from "react-router-dom";
import axios from "src/axios-config";

import OrderWordsExercise from "src/components/exercises/OrderWordsExercise";
import JoinWordsExercise from "src/components/exercises/JoinWordsExercise";
import CompleteExercise from "src/components/exercises/CompleteExercise";
import AnswerExercise from "src/components/exercises/AnswerExercise";
import ChooseRightAnswer from "src/components/exercises/ChooseRightAnswer";

import { Box, Button, Paper, Stack } from "@mui/material";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";

import NavigateNext from "@mui/icons-material/NavigateNext";
import {
  CenteringBox,
  LESSON_URL,
  SIGN_IN_PATH,
} from "src/utils";
import {
  playCorrectAudio,
  playWrongAudio,
  playLessonEndAudio,
} from "src/utils/media-service";

function renderExercise(
  exerciseObj: any,
  notifySubmission: any,
  idx: number | null = null
) {
  const switchObject: any = {
    [OrderWordsExercise.name]: (
      <OrderWordsExercise
        query={exerciseObj.query}
        wordpieces={exerciseObj.wordpieces}
        notifySubmission={notifySubmission}
        key={idx}
      />
    ),

    [JoinWordsExercise.name]: (
      <JoinWordsExercise
        query={exerciseObj.query}
        joinPairs={exerciseObj.joinpairs}
        notifySubmission={notifySubmission}
        key={idx}
      />
    ),

    [CompleteExercise.name]: (
      <CompleteExercise
        query={exerciseObj.query}
        textItems={exerciseObj.text_items}
        notifySubmission={notifySubmission}
        key={idx}
      />
    ),

    [AnswerExercise.name]: (
      <AnswerExercise
        question={exerciseObj.question}
        rightAnswer={exerciseObj.answer}
        notifySubmission={notifySubmission}
        key={idx}
      />
    ),

    [ChooseRightAnswer.name]: (
      <ChooseRightAnswer
        question={exerciseObj.question}
        answerChoices={exerciseObj.answer_choices}
        multiChoice={exerciseObj.multi_choice}
        notifySubmission={notifySubmission}
        key={idx}
      />
    ),
  };

  return switchObject[exerciseObj.type];
}

export async function loader({ params }: any) {
  if (localStorage.getItem("access") == null) {
    return redirect(SIGN_IN_PATH);
  }

  const lessonId = params.lessonId;

  const response = await axios.get(`${LESSON_URL}${lessonId}/`);

  return response.data!;
}

export default function LessonPage() {
  const lesson: any = useLoaderData();
  console.log(lesson);

  const exercises: any[] = lesson.exercises;

  const [displayContinue, setDisplayContinue] = useState<boolean>(false);
  const [exerciseCrtNr, setExerciseCrtNr] = useState(0);
  const [finished, setFinished] = useState<boolean>(false);
  const [scores, setScores] = useState(
    Array.from({ length: exercises.length }, () => 0)
  );
  const [fullScore, setFullScore] = useState<boolean>(false);

  function notifySubmission(allGood: boolean) {
    setScores((prevScores) =>
      prevScores.map((score: any, idx: number) =>
        idx === exerciseCrtNr ? +allGood : score
      )
    );

    if (allGood) {
      playCorrectAudio();
    } else {
      playWrongAudio();
    }

    setDisplayContinue(true);
  }

  function handleContinueClick(e: any) {
    setDisplayContinue(() => false);

    if (exerciseCrtNr + 1 === exercises.length) {
      setFinished(() => true);
      playLessonEndAudio()
    }

    axios
      .post(`${LESSON_URL}${lesson.id}/`, {
        completed: true,
      })
      .then((res) => console.log("post response:", res));

    if (scores.reduce((acc: number, x: number) => acc + x) === scores.length) {
      setFullScore(true);
    }

    setExerciseCrtNr((prev: number) => prev + 1);
  }

  return (
    <Stack spacing={2} mt={4} mb={1} useFlexGap>
      {!finished ? (
        renderExercise(
          exercises[exerciseCrtNr],
          notifySubmission,
          exerciseCrtNr
        )
      ) : (
        <Stack spacing={4}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}>
            <Paper
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                fontWeight: "700",
                maxWidth: "500px",
                padding: "20px",
              }}>
              <p style={{ textAlign: "center", fontSize: "1.5rem" }}>
                Lesson completed
              </p>
              <Stack direction="row" justifyContent="center">
                <label style={{ textAlign: "center", alignSelf: "center" }}>
                  Score:
                </label>
                <Gauge
                  innerRadius={"70%"}
                  width={120}
                  height={90}
                  value={scores.reduce((acc: number, x: number) => acc + x)}
                  valueMax={scores.length}
                  startAngle={-110}
                  endAngle={110}
                  sx={{
                    margin: {
                      left: "auto",
                    },
                    [`& .${gaugeClasses.valueText}`]: {
                      fontSize: 17,
                      transform: "translate(0px, 0px)",
                    },
                  }}
                  text={({ value, valueMax }) => `${value} / ${valueMax}`}
                />
                <CenteringBox></CenteringBox>
              </Stack>
              {fullScore && (
                <p style={{ textAlign: "center", fontSize: "1.7rem" }}>
                  Congratulations!
                </p>
              )}
            </Paper>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}>
            <Button variant="outlined">
              <Link to="/lessons" style={{ textDecoration: "none" }}>
                Back to lesson list
              </Link>
            </Button>
          </Box>
        </Stack>
      )}
      {displayContinue && (
        <CenteringBox>
          <Button
            variant="contained"
            disableTouchRipple
            endIcon={<NavigateNext />}
            onClick={handleContinueClick}>
            Continue
          </Button>
        </CenteringBox>
      )}
    </Stack>
  );
}
