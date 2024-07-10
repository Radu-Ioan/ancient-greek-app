import { Paper } from "@mui/material";

const QueryStatement = ({ text }: any) => (
  <Paper
    sx={{
      paddingX: "20px",
      paddingY: "10px",
      fontWeight: "700",
      fontSize: "1.2rem",
      textAlign: "center",
      whiteSpace: "normal",
      wordBreak: "break-word",
      hyphens: "auto",
    }}>
    {text}
  </Paper>
);

export default QueryStatement;
