import { useState, useEffect } from "react";
import { useLoaderData, redirect, Link } from "react-router-dom";
import axios from "src/axios-config";

import OrderWordsExercise from "src/components/exercises/OrderWordsExercise";
import JoinWordsExercise from "src/components/exercises/JoinWordsExercise";
import CompleteExercise from "src/components/exercises/CompleteExercise";
import AnswerExercise from "src/components/exercises/AnswerExercise";
import ChooseRightAnswer from "src/components/exercises/ChooseRightAnswer";

import { Box, Button, Paper, Stack } from "@mui/material";
import ScoreResult from "./components/ScoreResult";

import NavigateNext from "@mui/icons-material/NavigateNext";
import { CenteringBox, LESSON_URL, SIGN_IN_PATH } from "src/utils";
import {
  playCorrectAudio,
  playWrongAudio,
  playLessonEndAudio,
} from "src/utils/media-service";

const exerciseTypes = {
  answer: "AnswerExercise",
  choose: "ChooseRightAnswer",
  complete: "CompleteExercise",
  joinwords: "JoinWordsExercise",
  order: "OrderWordsExercise",
};

function renderExercise(
  exerciseObj: any,
  notifySubmission: any,
  idx: number | null = null
) {
  const switchObject: any = {
    [exerciseTypes.order]: (
      <OrderWordsExercise
        query={exerciseObj.query}
        wordpieces={exerciseObj.wordpieces}
        notifySubmission={notifySubmission}
        key={idx}
      />
    ),

    [exerciseTypes.joinwords]: (
      <JoinWordsExercise
        query={exerciseObj.query}
        joinPairs={exerciseObj.joinpairs}
        notifySubmission={notifySubmission}
        key={idx}
      />
    ),

    [exerciseTypes.complete]: (
      <CompleteExercise
        query={exerciseObj.query}
        textItems={exerciseObj.text_items}
        notifySubmission={notifySubmission}
        key={idx}
      />
    ),

    [exerciseTypes.answer]: (
      <AnswerExercise
        question={exerciseObj.question}
        rightAnswer={exerciseObj.answer}
        notifySubmission={notifySubmission}
        key={idx}
      />
    ),

    [exerciseTypes.choose]: (
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
    Array.from({ length: exercises.filter((e) => e.scored).length }, () => 0)
  );
  const [fullScore, setFullScore] = useState<boolean>(false);

  function handleSubmission(allGood: boolean, scored: boolean) {
    if (!scored) {
      setDisplayContinue(true);
      return;
    }

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
      playLessonEndAudio();
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
          (allGood: boolean) =>
            handleSubmission(allGood, exercises[exerciseCrtNr].scored),
          exerciseCrtNr
        )
      ) : (
        <ScoreResult
          scores={scores}
          fullScore={fullScore}
          backPath="/lessons"
        />
      )}
      {displayContinue && (
        <CenteringBox>
          <Button
            variant="contained"
            disableTouchRipple
            endIcon={<NavigateNext />}
            onClick={handleContinueClick}
          >
            Continue
          </Button>
        </CenteringBox>
      )}
    </Stack>
  );
}
