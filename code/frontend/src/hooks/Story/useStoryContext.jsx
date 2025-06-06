import { useContext } from "react";
import { StoryContext } from "../../context/StoryContext";

export const useStoryContext = () => {
  const context = useContext(StoryContext);

  if (!context) {
    throw new Error("useStoryContext must be used within a StoryContextProvider");
  }

  return context;
};
