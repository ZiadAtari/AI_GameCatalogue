import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RecommendationState {
  recommendations: Array<any>; // Adjust type according to your game object structure
  loading: boolean;
  error: string | null;
}

const initialState: RecommendationState = {
  recommendations: [],
  loading: false,
  error: null,
};

const recommendationsSlice = createSlice({
  name: 'recommendations',
  initialState,
  reducers: {
    fetchRecommendationsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchRecommendationsSuccess(state, action: PayloadAction<any[]>) {
      state.recommendations = action.payload;
      state.loading = false;
    },
    fetchRecommendationsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchRecommendationsStart,
  fetchRecommendationsSuccess,
  fetchRecommendationsFailure,
} = recommendationsSlice.actions;

export default recommendationsSlice.reducer;
