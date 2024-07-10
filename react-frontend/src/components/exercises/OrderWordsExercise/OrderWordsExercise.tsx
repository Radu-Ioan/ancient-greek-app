import { useState, useEffect } from "react";
import {
  Button,
  Container,
  Box,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import { styled } from "@mui/system";

import { CenteringBox, SubmissionAction } from "src/utils";
import QueryStatement from "src/components/exercises/QueryStatement";

import "./OrderWordsExercise.css";

const palette = {
  topWord: "white",
  bottomWord: "#F5F1F9",
  success: "green",
  error: "red",
  disabled: {
    success: "white",
    error: "white",
    default: "black",
  },
  background: {
    topBox: "rgba(186, 201, 246, 0.782)",
    bottomBox: "#b0e1f6",
    topWord: "#503565",
    bottomWord: "#256CAA",
    disabled: {
      success: "green",
      error: "#A00000",
      default: "#f1f9f7",
    },
  },
  topWordBorder: "1px solid rgba(69, 4, 109, 0.963)",
  bottomWordBorder: "1px solid blue",
};

const WordsBox = styled(Box)({
  width: "100%",
  maxWidth: "500px",
});

const PieceButton = styled("button")({
  fontFamily: "'Roboto', Helvetica, Arial, sans-serif",
  fontSize: "1.3rem",
  padding: "0.35rem",
  display: "inline-block",
  borderRadius: "0.4rem",
});

interface PieceData {
  text: string;
  id: number;
}

interface OrderWordsExerciseProps {
  query: string;
  wordpieces: string[];
  notifySubmission: SubmissionAction;
}

function renderCorrectAnswer(dataSet: PieceData[], wordsPushed: PieceData[]) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
      {dataSet.map((data: PieceData, idx: number) => (
        <span
          key={idx}
          style={{
            fontFamily: "'Roboto', Helvetica, Arial, sans-serif",
            fontSize: "1.5rem",
            fontWeight: data.text !== wordsPushed[idx].text ? "bold" : "",
          }}>
          {data.text}
        </span>
      ))}
    </Box>
  );
}

function OrderWordsExercise(props: OrderWordsExerciseProps) {
  const { query, wordpieces, notifySubmission } = props;

  const dataSet: PieceData[] = wordpieces.map((word: string, index: number) => {
    return { text: word, id: index };
  });

  const [wordsSet, setWordsSet] = useState([] as any[]);

  // bottom words must be shuffled
  useEffect(() => {
    setWordsSet(dataSet.sort((a: any, b: any) => 0.5 - Math.random()));
  }, []);

  const [usedWordsIds, setUsedWordsIds] = useState(new Set());

  const [wordsPushed, setWordsPushed] = useState<PieceData[]>([]);

  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // when the user clicks on the bottom box to put a word in order
  const handleBottomClick = (word: any) => {
    return () => {
      // in case the user clicks the box several
      // times, we ensure we don't add the same word multiple times
      if (!usedWordsIds.has(word.id)) {
        setWordsPushed((prevWords: any[]) => [...prevWords, word]);
        setUsedWordsIds(new Set([...usedWordsIds, word.id]));
      }
    };
  };

  // when is needed to push back to bottom a wrong positioned word
  const handleTopClick = (word: any) => {
    return () => {
      const newWordsPushed = wordsPushed.filter((w) => w.id !== word.id);
      setWordsPushed(newWordsPushed);
      const newUsedWordsIds = new Set(usedWordsIds);
      newUsedWordsIds.delete(word.id);
      setUsedWordsIds(newUsedWordsIds);
    };
  };

  // after filling the upper container, we check the result
  useEffect(() => {
    if (wordsPushed.length === dataSet.length) {
      // ensure comparing the text, not the id since there can be
      // multiple identical words
      const correctAnswer: boolean = dataSet.every(
        (w: any, idx: number) => w.text === wordsPushed[idx].text
      );
      setIsCorrect(correctAnswer);

      notifySubmission(correctAnswer);
    } else {
      setIsCorrect(null);
    }
  }, [wordsPushed]);

  return (
    <Container
      maxWidth="xl"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
      }}>
      {isCorrect !== null ? (
        isCorrect ? (
          <Typography
            sx={{ color: palette.success, textAlign: "center", fontSize: "1.5rem" }}>
            Very well
          </Typography>
        ) : (
          <CenteringBox sx={{ flexDirection: "column" }}>
            <Typography
              sx={{ color: palette.error, textAlign: "center", fontSize: "1.5rem" }}>
              Try again next time
            </Typography>
            <label style={{ textAlign: "center" }}>Correct answer:</label>
            {renderCorrectAnswer(dataSet, wordsPushed)}
          </CenteringBox>
        )
      ) : (
        <QueryStatement text={query} />
      )}

      <WordsBox
        key="top-container"
        sx={{
          minHeight: "200px",
          height: "max-content",
          margin: "1px",
          borderRadius: "10px",
          backgroundColor: palette.background.topBox,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          alignContent: "flex-start",
          padding: "0.4rem",
        }}>
        {wordsPushed.map((word: PieceData, index: number) => {
          return (
            <PieceButton
              key={index}
              style={{
                margin: "0.2rem",
                border: palette.topWordBorder,
                backgroundColor:
                  isCorrect === null
                    ? palette.background.topWord
                    : word.text === dataSet[index].text
                    ? isCorrect
                      ? palette.background.disabled.success
                      : palette.background.disabled.default
                    : palette.background.disabled.error,
                color:
                  isCorrect === null
                    ? palette.topWord
                    : word.text === dataSet[index].text
                    ? isCorrect
                      ? palette.disabled.success
                      : palette.disabled.default
                    : palette.disabled.error,
              }}
              onClick={handleTopClick(word)}
              disabled={isCorrect !== null}>
              {word.text}
            </PieceButton>
          );
        })}
      </WordsBox>

      {/* bottom container */}
      <WordsBox
        sx={{
          backgroundColor: palette.background.bottomBox,
          minHeight: "100px",
          borderRadius: "0.4rem",
          padding: "1rem",

          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}>
        {wordsSet.map((word: any) => {
          return (
            <PieceButton
              key={word.id}
              style={{
                margin: "0.3rem",
                backgroundColor: palette.background.bottomWord,
                color: usedWordsIds.has(word.id)
                  ? palette.background.bottomWord
                  : palette.bottomWord,
                border: palette.bottomWordBorder,
              }}
              onClick={handleBottomClick(word)}
              disabled={isCorrect !== null}>
              {word.text}
            </PieceButton>
          );
        })}
      </WordsBox>
    </Container>
  );
}

export { OrderWordsExercise };
export default OrderWordsExercise;
