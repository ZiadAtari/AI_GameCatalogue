import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './gameSlice';
import gameDetailReducer from './gameDetailSlice'; 
import questionnaireReducer from './questionnaireSlice';
import recommendationsReducer from './recommendationsSlice';
import gameAIReducer from './gameAIDetailsSlice';  // Make sure this import is correct

const store = configureStore({
  reducer: {
    game: gameReducer,
    gameDetail: gameDetailReducer, 
    questionnaire: questionnaireReducer,
    recommendations: recommendationsReducer,
    gameAI: gameAIReducer,  // Ensure gameAI is added to the reducer list
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
