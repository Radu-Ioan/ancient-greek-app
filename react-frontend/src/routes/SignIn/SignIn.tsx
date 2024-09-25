import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import axios from "axios";

import {
  Button,
  TextField,
  Stack,
  Container,
  Typography,
  AppBar,
  Toolbar,
} from "@mui/material";

import { useMediaQuery } from "@mui/material";

import { SERVER_URL, LESSON_PATH, LOGIN_URL, SIGN_UP_PATH } from "src/utils";

import "./SignIn.css";

async function handleLogin(username: string, password: string) {
  try {
    // Perform the API request to obtain the JWT token
    const response = await axios.post(`${SERVER_URL}${LOGIN_URL}`, {
      username,
      password,
    });

    console.log("Sign in response:", response);

    const { access, refresh } = response.data;

    const data = { access, refresh };

    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);

    return data
  } catch (error: any) {
    console.error("Login error:", error.message);
    return {
      errors: {
        form: "Invalid credentials"
      }
    };
  }
}

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({} as any)

  const navigate = useNavigate();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const response: any = await handleLogin(username, password);

    if (!response.errors) {
      navigate(LESSON_PATH);
    } else {
      setErrors(response.errors)
    }
  };

  const isSmallScreen = useMediaQuery("(max-width: 360px)");

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sign in
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to={SIGN_UP_PATH}>
            Sign up
          </Button>
        </Toolbar>
      </AppBar>
      <Container
        id="form-parent"
        maxWidth="sm"
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: 5,
        }}>
        <form onSubmit={handleSubmit} method="post">
          {errors.form && (
            <Typography color="error" variant="body2" mb={2}>
              {errors.form}
            </Typography>
          )}
          <Stack
            spacing={3}
            direction="column"
            sx={{ width: isSmallScreen ? "100%" : "350px" }}>
            <TextField
              required
              label="Username"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              required
              label="Password"
              margin="normal"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" variant="contained">
              Sign in
            </Button>
          </Stack>
        </form>
      </Container>
    </>
  );
}

export default SignIn;
