import axios from "axios";
import {
  BASE_URL,
  MEDIA_URL,
  correctAudioFilename,
  wrongAudioFilename,
  lessonEndAudioFilename,
} from "./utils";

import correctSound from "./media/correct-answer.wav"
import wrongSound from "./media/wrong-answer.mp3"
import lessonEndSound from "./media/lesson-end.wav"


const mediaFileNames = [
  correctAudioFilename,
  wrongAudioFilename,
  lessonEndAudioFilename,
];

export const audioCacheObjects: any = {};

const fetchAudio = async (filename: string) => {
  if (!audioCacheObjects[filename]) {
    const url = `${BASE_URL}${MEDIA_URL}${filename}`;

    try {
      const response = await axios.get(url, { responseType: "blob" });
      const blob = new Blob([response.data]);
      const media = URL.createObjectURL(blob)
      audioCacheObjects[filename] = new Audio(media);
    } catch (error) {
      console.error("Error preloading media:", error);
      audioCacheObjects[filename] = null;
    }
  }
};

export function preloadAudios() {
  for (let filename of mediaFileNames) {
    fetchAudio(filename);
  }
}

function playCorrectAudio() {
  const audio = new Audio(correctSound)
  console.log("correct audio:", audio);

  audio.play().then(() =>  {
    console.log("Audio played successfully");
  }).catch((error) => {
    console.log("Error playing the audio:", error);
  })
}

function playWrongAudio() {
  const audio = new Audio(wrongSound)
  console.log("wrong audio:", audio);

  audio.play().then(() =>  {
    console.log("Audio played successfully");
  }).catch((error) => {
    console.log("Error playing the audio:", error);
  })
}

function playLessonEndAudio() {
  const audio = new Audio(lessonEndSound)

  console.log("Play end sound entered");
  audio.play().then(() =>  {
    console.log("Audio played successfully");
  }).catch((error) => {
    console.log("Error playing the audio:", error);
  })
}

export { playCorrectAudio, playWrongAudio, playLessonEndAudio }
