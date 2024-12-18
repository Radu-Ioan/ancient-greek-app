import { useState } from "react";
import { useLoaderData, redirect, useNavigate } from "react-router-dom";
import axios from "src/axios-config";

import OrderWordsExercise from "src/components/exercises/OrderWordsExercise";
import JoinWordsExercise from "src/components/exercises/JoinWordsExercise";
import CompleteExercise from "src/components/exercises/CompleteExercise";
import AnswerExercise from "src/components/exercises/AnswerExercise";
import ChooseRightAnswer from "src/components/exercises/ChooseRightAnswer";

import { Button, Stack } from "@mui/material";

import ScoreResult from "./components/ScoreResult";

import NavigateNext from "@mui/icons-material/NavigateNext";
import { LESSON_URL, SIGN_IN_PATH, BASE_SERVER_URL } from "src/utils";
import {
  playCorrectAudio,
  playWrongAudio,
  playLessonEndAudio,
} from "src/utils/media-service";
import ProgressLine from "./components/ProgressLine";
import CloseModal from "./components/CloseModal";
import TipExercise from "src/components/exercises/TipExercise";

const exerciseTypes = {
  answer: "AnswerExercise",
  choose: "ChooseRightAnswer",
  complete: "CompleteExercise",
  joinwords: "JoinWordsExercise",
  order: "OrderWordsExercise",
  tip: "TipText",
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
        imageUrl={
          exerciseObj.image
            ? `${BASE_SERVER_URL}${exerciseObj.image}`
            : undefined
        }
        audioUrl={
          exerciseObj.audio
            ? `${BASE_SERVER_URL}${exerciseObj.audio}`
            : undefined
        }
        notifySubmission={notifySubmission}
        key={idx}
      />
    ),

    [exerciseTypes.answer]: (
      <AnswerExercise
        question={exerciseObj.question}
        rightAnswer={exerciseObj.answer}
        imageUrl={
          exerciseObj.image
            ? `${BASE_SERVER_URL}${exerciseObj.image}`
            : undefined
        }
        audioUrl={
          exerciseObj.audio
            ? `${BASE_SERVER_URL}${exerciseObj.audio}`
            : undefined
        }
        notifySubmission={notifySubmission}
        key={idx}
      />
    ),

    [exerciseTypes.choose]: (
      <ChooseRightAnswer
        question={exerciseObj.question}
        answerChoices={exerciseObj.answer_choices}
        multiChoice={exerciseObj.multi_choice}
        imageUrl={
          exerciseObj.image
            ? `${BASE_SERVER_URL}${exerciseObj.image}`
            : undefined
        }
        audioUrl={
          exerciseObj.audio
            ? `${BASE_SERVER_URL}${exerciseObj.audio}`
            : undefined
        }
        notifySubmission={notifySubmission}
        key={idx}
      />
    ),

    [exerciseTypes.tip]: (
      <TipExercise
        text={exerciseObj.text}
        imageUrl={
          exerciseObj.image
            ? `${BASE_SERVER_URL}${exerciseObj.image}`
            : undefined
        }
        audioUrl={
          exerciseObj.audio
            ? `${BASE_SERVER_URL}${exerciseObj.audio}`
            : undefined
        }
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

  // this function is run after an exercise is completed, obviously if it is
  // scored, otherwise it is simply called when the respective exercise
  // component was passed by the user
  function handleSubmission(allGood: boolean, scored: boolean) {
    if (!scored) {
      setDisplayContinue(true);
      return;
    }

    // if the exercise was correctly solved, mark its flag to true
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

    if (scores.reduce((acc: number, x: number) => acc + x, 0) === scores.length) {
      setFullScore(true);
    }

    setExerciseCrtNr((prev: number) => prev + 1);
  }

  const [closeModalOpen, setcloseModalOpen] = useState(false);

  const handleExitBtn = () => {
    setcloseModalOpen(true);
  };

  const handleClose = () => {
    setcloseModalOpen(false);
  };

  const navigate = useNavigate();

  return (
    <Stack spacing={2} mb={1} useFlexGap style={{ height: "100vh" }}>
      <div className="mt-2">
        <ProgressLine
          exerciseCrtNr={exerciseCrtNr}
          exercises={exercises}
          className="mx-2 mt-3"
        ></ProgressLine>
      </div>

      <CloseModal
        closeModalOpen={closeModalOpen}
        handleClose={handleClose}
        exitAction={() => navigate("/lessons")}
      ></CloseModal>

      {!finished ? (
        <div className="d-flex flex-column flex-grow-1">
          {renderExercise(
            exercises[exerciseCrtNr],
            (allGood: boolean) =>
              handleSubmission(allGood, exercises[exerciseCrtNr].scored),
            exerciseCrtNr
          )}
          <div className="d-flex flex-column align-items-center flex-grow-1 mx-1 mt-2">
            {displayContinue && (
              <Button
                className="my-2"
                sx={{
                  width: {
                    xs: "100%",
                    sm: "50%",
                    md: "200px",
                  },
                  fontSize: "1rem",
                  textTransform: "none",
                }}
                variant="contained"
                disableTouchRipple
                endIcon={<NavigateNext />}
                onClick={handleContinueClick}
              >
                Continue
              </Button>
            )}
            <Button
              type="button"
              variant="contained"
              className="mt-auto ms-auto mb-2"
              style={{
                backgroundColor: "#942906",
              }}
              onClick={handleExitBtn}
            >
              Exit
            </Button>
          </div>
        </div>
      ) : (
        <ScoreResult
          scores={scores}
          fullScore={fullScore}
          backPath="/lessons"
        />
      )}
    </Stack>
  );
}
