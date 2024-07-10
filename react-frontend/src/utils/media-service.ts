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
  audio.play()
}

function playWrongAudio() {
  const audio = new Audio(wrongSound)
  audio.play()
}

function playLessonEndAudio() {
  const audio = new Audio(lessonEndSound)
  audio.play()
}

export { playCorrectAudio, playWrongAudio, playLessonEndAudio }
