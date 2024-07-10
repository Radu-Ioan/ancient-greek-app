import { Box, styled } from "@mui/material";

export interface Pair<K, V> {
    first: K;
    second: V;
}

export type SubmissionAction = (allGood: boolean) => void;

export const CenteringBox = styled(Box)({
    display: "flex",
    justifyContent: "center",
})

export const bgSubmitBtn = "#54078F"
export const bgHoverSubmitBtn = "#622193"

export const BASE_URL = "http://localhost:8000/"
export const LOGIN_URL = "account/api/token/"
export const TOKEN_REFRESH_URL = "account/api/token/refresh/"
export const REGISTER_URL = "account/api/signup/"
export const LESSON_URL = "api/lessons/"
export const MEDIA_URL = "media/"

export const SIGN_IN_PATH = "/signin"
export const SIGN_UP_PATH = "/signup"
export const LESSON_PATH = "/lessons"
export const CONFIRM_REGISTER_PATH = "/registration-successful"

export const correctAudioFilename = "correct-answer.wav"
export const wrongAudioFilename = "wrong-answer.mp3"
export const lessonEndAudioFilename = "lesson-end.wav"
