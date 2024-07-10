import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "src/axios-config";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { REGISTER_URL, CONFIRM_REGISTER_PATH, SIGN_IN_PATH } from "src/utils";
import { Typography } from "@mui/material";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(REGISTER_URL, formData);

      console.log("Sign up response:", response.data);

      if (response.data.errors) {
        setErrors(response.data.errors)
      } else {
        navigate(CONFIRM_REGISTER_PATH);
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        console.error("Registration error:", error);
      }
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sign Up
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to={SIGN_IN_PATH}>
            Sign in
          </Button>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="xs">
        <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            onChange={handleChange}
            error={!!errors.username}
            helperText={errors.username ? errors.username[0] : ""}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password ? errors.password[0] : ""}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="first_name"
            label="First Name"
            name="first_name"
            autoComplete="fname"
            onChange={handleChange}
            error={!!errors.first_name}
            helperText={errors.first_name ? errors.first_name[0] : ""}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="last_name"
            label="Last Name"
            name="last_name"
            autoComplete="lname"
            onChange={handleChange}
            error={!!errors.last_name}
            helperText={errors.last_name ? errors.last_name[0] : ""}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 1 }}>
            Sign Up
          </Button>
        </form>
      </Container>
    </>
  );
};

export default SignUp;
