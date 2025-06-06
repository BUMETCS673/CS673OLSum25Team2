import { createContext, useReducer } from "react";

export const StoryContext = createContext();

export const StoryReducer = (state, action) => {
  switch (action.type) {
    case "GENERATE_STORY":
      return {
        ...state,
        generatedStory: action.payload,
        stories: [action.payload, ...state.stories],
        loading: false,
        error: null,
      };
    case "GET_STORY":
      return {
        ...state,
        currentStory: action.payload,
        loading: false,
        error: null,
      };
    case "GET_STORIES":
      return {
        ...state,
        stories: action.payload,
        loading: false,
        error: null,
      };

    case "TOGGLE_FAVORITE":
      return {
        ...state,
        stories: state.stories.map((story) =>
          story._id === action.payload.id
            ? { ...story, isFavorite: action.payload.isFavorite }
            : story
        ),
        currentStory:
          state.currentStory?._id === action.payload.id
            ? { ...state.currentStory, isFavorite: action.payload.isFavorite }
            : state.currentStory,
      };

    case "INCREMENT_READ_COUNT":
      return {
        ...state,
        stories: state.stories.map((story) =>
          story._id === action.payload
            ? { ...story, readCount: (story.readCount || 0) + 1 }
            : story
        ),
        currentStory:
          state.currentStory?._id === action.payload
            ? {
                ...state.currentStory,
                readCount: (state.currentStory.readCount || 0) + 1,
              }
            : state.currentStory,
      };

    default:
      return state;
  }
};

export const StoryContextProvider = ({ children }) => {
  const initialState = {
    generatedStory: null,
    stories: [],
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
