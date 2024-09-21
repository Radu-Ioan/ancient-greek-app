import {
  Container,
  Button,
  Stack,
  Popover,
  Paper,
  Typography,
  AppBar,
  Toolbar,
} from "@mui/material";
import CheckCircleOutlineTwoToneIcon from "@mui/icons-material/CheckCircleOutlineTwoTone";

import axios from "src/axios-config";
import { useLoaderData, redirect, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { LESSON_URL, SIGN_IN_PATH } from "src/utils";

interface LessonHeader {
  title: string;
  description: string;
  completed: boolean;
  id: string | number;
}

export async function loader() {
  if (localStorage.getItem("access") == null) {
    return redirect(SIGN_IN_PATH);
  }

  const response = await axios.get(`${LESSON_URL}`);
  console.log("response:", response);

  return response.data;
}

const handleClick = (
  event: React.MouseEvent<HTMLButtonElement>,
  idx: number,
  anchorButtons: any[],
  setAnchorButtons: any
) => {
  setAnchorButtons(
    anchorButtons.map((b: any, index: number) =>
      idx === index ? event.currentTarget : b
    )
  );
};

const handleClose = (
  idx: number,
  anchorButtons: any[],
  setAnchorButtons: any
) => {
  setAnchorButtons(
    anchorButtons.map((b: any, index: number) => (idx === index ? null : b))
  );
};

function LessonList() {
  const lessons: LessonHeader[] = useLoaderData() as any[];

  const [anchorButtons, setAnchorButtons] = useState(
    Array.from({ length: lessons.length }, () => null)
  );

  const navigate = useNavigate();

  function handleSignOut() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    navigate("/");
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography
            fontSize="2rem"
            fontWeight="bold"
            sx={{
              flexGrow: 1,
            }}
          >
            Lessons
          </Typography>
          <Button color="inherit" onClick={handleSignOut}>
            Sign out
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Stack
          mt={3}
          mb={4}
          spacing={1}
          width={{
            xs: "100%",
            sm: "400px",
            md: "600px",
          }}
        >
          {lessons.map((lesson: LessonHeader, idx: number) => (
            <div key={idx}>
              <Button
                aria-describedby={`simple-popover-${idx}`}
                color={lesson.completed ? "success" : "inherit"}
                fullWidth
                sx={{
                  textTransform: "none",
                  textDecorationColor: "none",
                  fontSize: "1.3rem",
                  justifyContent: "flex-start",
                }}
                onClick={(e) =>
                  handleClick(e, idx, anchorButtons, setAnchorButtons)
                }
              >
                <div className="d-flex flex-grow-1">
                  <div>{lesson.title}</div>
                  <div className="ms-auto"> 
                    {lesson.completed ? (
                    <CheckCircleOutlineTwoToneIcon color="success" />) : ( "" )}
                  </div>
                </div>
              </Button>
              <Popover
                id={anchorButtons[idx] ? `simple-popover-${idx}` : undefined}
                open={Boolean(anchorButtons[idx])}
                anchorEl={anchorButtons[idx]}
                onClose={(e) =>
                  handleClose(idx, anchorButtons, setAnchorButtons)
                }
                anchorOrigin={{
                  vertical: "center",
                  horizontal: "center",
                }}
              >
                <Paper
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    padding: 2,
                  }}
                >
                  <Typography fontSize="1.7rem" fontWeight="600">
                    {lesson.title}
                  </Typography>
                  <Typography>{lesson.description}</Typography>
                  <Link to={`${lesson.id}`} style={{ textDecoration: "none" }}>
                    <Button sx={{ textTransform: "none" }}>Start lesson</Button>
                  </Link>
                </Paper>
              </Popover>
            </div>
          ))}
        </Stack>
      </Container>
    </>
  );
}

export default LessonList;
