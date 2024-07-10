import { useEffect, useState } from "react";
import { Button, Container, Stack, Typography } from "@mui/material";
import { styled } from "@mui/system";

import {
  SubmissionAction,
  Pair,
  CenteringBox,
  correctAudioFilename,
  wrongAudioFilename,
} from "src/utils";
import QueryStatement from "src/components/exercises/QueryStatement";
import { playCorrectAudio, playWrongAudio } from "src/utils/media-service";

import "./JoinWordsExercise.css";

const colWidth = {
  xs: "200px",
  sm: "250px",
  md: "300px",
};

const palette = {
  normal: "black",
  selected: {
    success: "#ffe9ce",
    error: "#ffe9ce",
    normal: "#ffe9ce",
  },
  disabled: {
    success: "#ffe9ce",
    error: "#ffe9ce",
  },
  background: {
    normal: "white",
    selected: {
      success: "green",
      error: "#a00000",
      normal: "#3777ff",
    },
    disabled: {
      success: "green",
    },
    hover: {
      normal: "#70ACE5",
      selected: "currentcolor",
    },
  },
};

interface ColumnItem {
  text: string;
  index: number;
}

interface JoinPairs {
  columnOne: ColumnItem[];
  columnTwo: ColumnItem[];
}

interface JoinWordsExerciseProps {
  query: string;
  joinPairs: JoinPairs;
  notifySubmission: SubmissionAction;
}

function updateCorrectness(columnPosition: number, setColumn: any) {
  setColumn((prevCol: any[]) =>
    prevCol.map((item, idx) =>
      idx === columnPosition ? { ...item, isCorrect: true } : item
    )
  );
}

function updateWrongness(
  columnPosition: number,
  setColumn: any,
  value: boolean = true
) {
  setColumn((prevCol: any[]) =>
    prevCol.map((item, idx) =>
      idx === columnPosition ? { ...item, isWrong: value } : item
    )
  );
}

function updateOrder(columnPosition: number, setColumn: any) {
  setColumn((prevCol: any[]) => {
    const newList = [...prevCol];
    const poppedElement = prevCol[columnPosition];
    newList.splice(columnPosition, 1);

    const indexToInsert = newList.findIndex((item) => !item.isCorrect);

    newList.splice(indexToInsert, 0, poppedElement);
    return newList;
  });
}

function JoinWordsExercise(props: JoinWordsExerciseProps) {
  const { query, joinPairs, notifySubmission } = props;
  const { columnOne, columnTwo } = joinPairs;
  const columnsLength = columnOne.length;

  const [columnOneState, setColumnOneState] = useState(
    columnOne.map((item) => ({ ...item, isWrong: false, isCorrect: false }))
  );
  const [columnTwoState, setColumnTwoState] = useState(
    columnTwo.map((item) => ({ ...item, isWrong: false, isCorrect: false }))
  );

  const [selected, setSelected] = useState<{
    col: number;
    index: number;
  } | null>(null);

  const [matchedCount, setMatchedCount] = useState<number>(0);

  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (matchedCount === columnsLength) {
      setFinished(() => true);
      notifySubmission(true);
    }
  }, [matchedCount]);

  // col is the column (1 or 2), index is the position on the column
  // (ranges from 0 to columnOne.length - 1 inclusive)
  const handleSelect = (col: number, index: number) => {
    if (matchedCount === columnOne.length) return;

    if (selected !== null) {
      if (selected.col === col && selected.index === index) {
        // unselect the button
        setSelected(null);
        return;
      }

      if (selected.col !== col) {
        // a pair was selected

        // these indexes represent positions in the column,
        // not the ids from ColumnItem;
        // so col1Position is the position on the column one for the element
        // selected from left and col2 is for the one on the right
        const col1Position = selected.col === 1 ? selected.index : index;
        const col2Position = selected.col === 2 ? selected.index : index;

        if (
          columnOneState[col1Position].index ===
          columnTwoState[col2Position].index
        ) {
          // correct join
          setMatchedCount((count) => count + 1);

          playCorrectAudio();

          updateCorrectness(col1Position, setColumnOneState);
          updateCorrectness(col2Position, setColumnTwoState);

          updateOrder(col1Position, setColumnOneState);
          updateOrder(col2Position, setColumnTwoState);
        } else {
          // wrong join
          playWrongAudio();

          updateWrongness(col1Position, setColumnOneState);
          updateWrongness(col2Position, setColumnTwoState);

          setTimeout(() => {
            updateWrongness(col1Position, setColumnOneState, false);
            updateWrongness(col2Position, setColumnTwoState, false);
          }, 500);
        }

        // regardless of correctness, the 2 buttons shall become unselected
        setSelected(null);
      } else {
        setSelected({ col, index });
      }
    } else {
      setSelected({ col, index });
    }
  };

  const getButtonStyle = (col: number, index: number) => {
    let bgColor = "";
    let color = "";

    const item = col === 1 ? columnOneState[index] : columnTwoState[index];

    if (item.isCorrect) {
      bgColor = palette.background.disabled.success;
      color = palette.disabled.success;
    } else if (item.isWrong) {
      bgColor = palette.background.selected.error;
      color = palette.selected.error;
    } else if (selected !== null) {
      if (index === selected.index && col === selected.col) {
        bgColor = palette.background.selected.normal;
        color = palette.selected.normal;
      }
    }

    return {
      backgroundColor: bgColor,
      color: color,
    };
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
      }}>
      <QueryStatement text={query} />
      <CenteringBox
        sx={{
          gap: 5,
          flexDirection: {
            xs: "column",
            sm: "row",
          },
        }}>
        <Stack spacing={1} width={colWidth}>
          {columnOneState.map((item: any, idx: number) => (
            <button
              key={idx}
              id={`id_btn_1_${idx}`}
              className="col-btn"
              style={getButtonStyle(1, idx)}
              disabled={item.isCorrect || item.isWrong}
              onClick={() => handleSelect(1, idx)}>
              <Typography
                align="center"
                sx={{
                  fontSize: "1.4rem",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  hyphens: "auto",
                  textAlign: "center",
                  textTransform: "none",
                }}>
                {item.text}
              </Typography>
            </button>
          ))}
        </Stack>
        <Stack spacing={1} width={colWidth}>
          {columnTwoState.map((item: any, idx: number) => (
            <button
              key={idx}
              id={`id_btn_2_${idx}`}
              className="col-btn"
              style={getButtonStyle(2, idx)}
              disabled={item.isCorrect}
              onClick={() => handleSelect(2, idx)}>
              <Typography
                align="center"
                sx={{
                  fontSize: "1.4rem",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  hyphens: "auto",
                  textAlign: "center",
                  textTransform: "none",
                }}>
                {item.text}
              </Typography>
            </button>
          ))}
        </Stack>
      </CenteringBox>
      {finished && (
        <Typography
          align="center"
          color="green"
          sx={{
            fontSize: "1.3rem",
            paddingX: "20px",
            paddingY: "10px",
          }}>
          Very well
        </Typography>
      )}
    </Container>
  );
}

export default JoinWordsExercise;
