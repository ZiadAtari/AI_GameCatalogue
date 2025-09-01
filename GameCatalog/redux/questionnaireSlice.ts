// questionnaireSlice.ts

import { createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';

interface QuestionnaireState {
  answers: {
    genre: string;
    mode: string;
    games: string;
  };
}

const initialState: QuestionnaireState = {
  answers: {
    genre: '',
    mode: '',
    games: '',
  },
};

const questionnaireSlice = createSlice({
  name: 'questionnaire',
  initialState,
  reducers: {
    setQuestionnaireAnswers: (state, action) => {
      state.answers = action.payload;
    },
  },
});

export const { setQuestionnaireAnswers } = questionnaireSlice.actions;
export default questionnaireSlice.reducer;

// Selector to get preferences
export const selectPreferences = (state: RootState) => state.questionnaire.answers;

