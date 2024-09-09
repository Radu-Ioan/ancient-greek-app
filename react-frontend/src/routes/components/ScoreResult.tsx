import { Box, Button, Paper, Stack } from "@mui/material";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import { Link } from "react-router-dom";
import { CenteringBox } from "src/utils";

export default function ScoreResult({ scores, fullScore, backPath }: any) {
  return (
    <Stack spacing={4}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Paper
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            fontWeight: "700",
            maxWidth: "500px",
            padding: "20px",
          }}
        >
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
        }}
      >
        <Button variant="outlined">
          <Link to={backPath} style={{ textDecoration: "none" }}>
            Back to lesson list
          </Link>
        </Button>
      </Box>
    </Stack>
  );
}

export { ScoreResult }
