import { useState } from "react";
import { useStoryContext } from "./useStoryContext";
import { useAuthContext } from "../Auth/useAuthContext";

export const useToggleFavorites = () => {
  const { dispatch } = useStoryContext();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { user } = useAuthContext();

  const toggleFavorites = async (storyId, p_isFavorite) => {
    setIsLoading(true);
    setError(null);

    const BASE_URL =
      window.location.protocol === "file:" ||
      window.location.hostname === "localhost"
        ? "http://localhost:5500"
        : "https://mymagicalbedtime-25abceb2c11f.herokuapp.com";

    const response = await fetch(`${BASE_URL}/api/stories/${storyId}/save`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        isFavorite: p_isFavorite,
      }),
    });

    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }

    if (response.ok) {
      // Dispatch the fetched story to the context
      dispatch({ type: "GET_STORIES", payload: json.response.stories });
      console.log("Fetched Story:", json);
      setIsLoading(false);
    }
  };

  return { toggleFavorites, isLoading, error };
};
