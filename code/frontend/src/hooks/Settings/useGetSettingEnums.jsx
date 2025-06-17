import { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/Auth/useAuthContext";

export const useGetSettingEnums = () => {
  const [enums, setEnums] = useState(null);
  const [isEnumsLoading, setIsEnumsLoading] = useState(true);
  const [enumsError, setEnumsError] = useState(null);
  const { user } = useAuthContext();

  const getSettingEnums = async () => {
    try {
      setIsEnumsLoading(true);

      const BASE_URL =
        window.location.protocol === "file:" ||
        window.location.hostname === "localhost"
          ? "http://localhost:5500"
          : "https://mymagicalbedtime-25abceb2c11f.herokuapp.com";

      const response = await fetch(`${BASE_URL}/api/settings/enums`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch enums");
      }

      const data = await response.json();
      setEnums(data);
    } catch (error) {
      console.error("Failed to fetch enums:", error);
      setEnumsError(error);
    } finally {
      setIsEnumsLoading(false);
    }
  };

  useEffect(() => {
    getSettingEnums();
  }, []);

  return {
    enums,
    isEnumsLoading,
    enumsError,
    refetchEnums: getSettingEnums,
  };
};
