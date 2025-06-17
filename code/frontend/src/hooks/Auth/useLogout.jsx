import { useAuthContext } from "./useAuthContext";
import { useState } from "react";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const logout = async () => {
    const BASE_URL =
      window.location.protocol === "file:" ||
      window.location.hostname === "localhost"
        ? "http://localhost:5500"
        : "https://mymagicalbedtime-25abceb2c11f.herokuapp.com";
        
    const response = await fetch(`${BASE_URL}/api/user/logout`, {
      method: "POST",
    });

    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }
    if (response.ok) {
      // Remove user from local storage
      localStorage.removeItem("user");
      dispatch({ type: "LOGOUT" });

      setIsLoading(false);
    }
  };
  return { logout, error, isLoading };
};
