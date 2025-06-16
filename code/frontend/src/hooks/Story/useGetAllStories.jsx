import { useState } from "react";
import { useStoryContext } from "../../hooks/Story/useStoryContext";
import { useAuthContext } from "../../hooks/Auth/useAuthContext";

export const useGetAllStories = () => {
  const { dispatch } = useStoryContext();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { user } = useAuthContext();

  const getAllStories = async () => {
    setIsLoading(true);
    setError(null);

    const BASE_URL =
      window.location.protocol === "file:" ||
      window.location.hostname === "localhost"
        ? "http://localhost:5500"
        : "https://mymagicalbedtime-25abceb2c11f.herokuapp.com";

    const response = await fetch(`${BASE_URL}/api/stories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }

    if (response.ok) {
      // Dispatch the fetched stories to the context
      dispatch({ type: "GET_STORIES", payload: json.response.stories });
      console.log("Fetched Stories:", json);
      setIsLoading(false);
    }
  };
  return { getAllStories, getAllStoriesLoading: isLoading, getAllStoriesError: error  };
};
