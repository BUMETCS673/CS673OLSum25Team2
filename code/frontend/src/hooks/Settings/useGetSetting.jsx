import { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/Auth/useAuthContext";

export const useGetSetting = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [setting, setSetting] = useState(null);
  const { user } = useAuthContext();

  const BASE_URL =
    window.location.protocol === "file:" ||
    window.location.hostname === "localhost"
      ? "http://localhost:5500"
      : "https://mymagicalbedtime-25abceb2c11f.herokuapp.com";

  const getSetting = async () => {
    if (!user?.token) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/api/settings`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.error || "Failed to fetch settings");
        setSetting(null); // important to clear invalid data
      } else {
        setSetting(json.settings || json); // make sure it's the actual setting object
      }
    } catch (err) {
      console.error("Network error:", err); // good to log
      setError("Network error or server not reachable");
      setSetting(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      getSetting();
    }
  }, [user?.token]);

  return {
    setting,
    isGetSettingLoading: isLoading,
    getSettingError: error,
    refetchSetting: getSetting,
  };
};
