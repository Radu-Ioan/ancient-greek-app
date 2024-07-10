import { Link } from "react-router-dom";

import { CenteringBox } from "src/utils";
import { Button, Paper, Stack, styled, Typography } from "@mui/material";

export default function Root() {
  return (
    <Stack spacing={3} mt={5} mx={2}>
      <CenteringBox>
        <Paper
          sx={{
            paddingY: "30px",
            paddingX: "25px",
            textAlign: "center",
            fontSize: "2rem",
            fontWeight: "bold",
          }}>
          Welcome to a challenging learning journey!
        </Paper>
      </CenteringBox>
      <CenteringBox>
        <Stack
          spacing={1}
          sx={{
            width: {
              xs: "100%",
              sm: 300,

              lg: 400,
              xl: 500,
            },
          }}>
          <Link
            to="signin"
            style={{
              textDecoration: "none",
              color: "white",
            }}>
            <Button variant="contained" fullWidth>
              Sign in
            </Button>
          </Link>
          <Link
            to="/signup"
            style={{ textDecoration: "none", color: "white" }}>
            <Button variant="contained" fullWidth>
              Sign up
            </Button>
          </Link>
        </Stack>
      </CenteringBox>
    </Stack>
  );
}
