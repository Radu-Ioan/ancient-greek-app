import { Stack } from "@mui/material";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import ImageBox from "src/components/exercises/ImageBox";
import { SubmissionAction } from "src/utils";

interface TipExerciseProps {
  text: string;
  imageUrl?: string;
  audioUrl?: string;
  notifySubmission: SubmissionAction;
}

function TipExercise(props: TipExerciseProps) {
  const { text, imageUrl, audioUrl, notifySubmission } = props;

  useEffect(() => {
    notifySubmission(true);
  }, []);

  return (
    <Stack>
      <div className="d-flex flex-column  align-items-center">
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
      {imageUrl && <ImageBox imageUrl={imageUrl} />}
      {audioUrl && (
        <audio controls className="rounded p-2" autoPlay>
          <source src={audioUrl} type="audio/mp3" />
          <source src={audioUrl} type="audio/wav" />
          <source src={audioUrl} type="audio/ogg" />
          Your browser does not support the audio element.
        </audio>
      )}
    </Stack>
  );
}

export default TipExercise;
