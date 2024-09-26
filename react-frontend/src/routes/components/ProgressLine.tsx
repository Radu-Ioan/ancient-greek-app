import { LinearProgress } from "@mui/material";


function ProgressLine(props: any) {
  const { exerciseCrtNr, exercises }: any = props;

  return (
    <div className="d-flex justify-content-center align-items-center">
      <LinearProgress
        value={(exerciseCrtNr / exercises.length) * 100}
        variant="determinate"
        sx={{
          height: "10px",
          borderRadius: "2px",
          width: {
            xs: "80%",
            sm: "50%",
          },
          marginTop: {
            xs: "20px",
            sm: "5px",
          },
        }}
      ></LinearProgress>
    </div>
  );
}

export default ProgressLine;
