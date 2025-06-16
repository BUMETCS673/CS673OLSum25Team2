import { useState } from "react";
import { useAuthContext } from "../../hooks/Auth/useAuthContext";

export const useGenSampleAudio = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { user } = useAuthContext();

  const GenerateSampleAudio = async (voice, model) => {
    setIsLoading(true);
    setError(null);

    const BASE_URL =
      window.location.protocol === "file:" ||
      window.location.hostname === "localhost"
        ? "http://localhost:5500"
        : "https://mymagicalbedtime-25abceb2c11f.herokuapp.com";

    const response = await fetch(
      `${BASE_URL}/api/stories/generate/audio_sample`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          try_voice: voice,
          try_model: model,
        }),
      }
    );

    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
      console.log(json.error);
    }

    if (response.ok) {
      setIsLoading(false);
      return json;
    }
  };
  return { GenerateSampleAudio, isPreviewLoading: isLoading, PreviewError: error };
};
