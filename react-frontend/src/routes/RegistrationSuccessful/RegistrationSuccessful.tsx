import { Button, Stack, Typography, Container } from "@mui/material";
import { Link } from "react-router-dom";
import { SIGN_IN_PATH } from "src/utils";

function RegistrationSuccessful() {
  return (
    <Container>
      <Stack mt={2} spacing={3}>
        <Typography textAlign="center">
          You have been successfully registered. Now, you may go to sign in
          page.
        </Typography>
        <Button
          component={Link}
          to={SIGN_IN_PATH}
          sx={{
            alignSelf: "center",
            width: {
              xs: "100%",
              sm: "200px",
            },
          }}>
          Sign in
        </Button>
      </Stack>
    </Container>
  );
}

export default RegistrationSuccessful;
