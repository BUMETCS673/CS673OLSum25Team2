import { createContext, useReducer } from "react";

export const StoryContext = createContext();

export const StoryReducer = (state, action) => {
  switch (action.type) {
    case "GENERATE_STORY":
      return {
        ...state,
        generatedStory: action.payload,
        loading: false,
        error: null,
      };
    case "RESET_GENERATE_STORY":
      return {
        ...state,
        generatedStory: null,
        loading: false,
        error: null,
      };
    case "GET_STORIES":
      return {
        ...state,
        allStories: action.payload,
        loading: false,
        error: null,
      };

    default:
      return state;
  }
};

export const StoryContextProvider = ({ children }) => {
  const initialState = {
    generatedStory: null,
    allStories: [],
    currentStory: null,
    loading: false,
    error: null,
  };

  const [state, dispatch] = useReducer(StoryReducer, initialState);

  return (
    <StoryContext.Provider value={{ ...state, dispatch }}>
      {children}
    </StoryContext.Provider>
  );
};
