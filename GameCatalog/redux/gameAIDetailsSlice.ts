// redux/gameAIDetailsSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunk for generating game description
export const generateGameDescription = createAsyncThunk(
    'gameAI/generateGameDescription',
    async (gameName: string, { rejectWithValue }) => {
      try {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'llama3.1:latest',
            prompt: `Generate a one-paragraph description for the game "${gameName}", return only the description with not additonal formating or text.`,
            options: { temperature: 0.8 },
          }),
        };
  
        const response = await fetch('http://127.0.0.1:11434/api/generate', requestOptions);
  
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
  
        const reader = response.body?.getReader();
  
        if (!reader) {
          // Throw an error or handle it if reader is undefined
          throw new Error('Failed to get reader from response body');
        }
  
        let serverResponse = '';
        let done = false;
  
        while (!done) {
          const { value, done: streamDone } = await reader.read();
          done = streamDone;
  
          if (value) {
            serverResponse += new TextDecoder('utf-8').decode(value);
          }
        }
  
        const jsonObjects = serverResponse
          .trim()
          .split('\n')
          .filter(line => line.trim() !== '');
  
        let completeResponse = '';
        for (const jsonObject of jsonObjects) {
          try {
            const data = JSON.parse(jsonObject);
  
            if (data.response) {
              completeResponse += data.response;
            }
  
            if (data.done) {
              break;
            }
          } catch {
            // Ignore JSON parsing errors
          }
        }
  
        return completeResponse;
      } catch (error) {
        console.error('Error generating game description:', error);
        return rejectWithValue('Failed to generate description');
      }
    }
  );
  

// Thunk for generating game review
export const generateGameReview = createAsyncThunk(
  'gameAI/generateGameReview',
  async ({ gameName, preferences }: { gameName: string; preferences: any }) => {
    const { genre, mode, games } = preferences;
    const response = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.1:latest",
        prompt: `Generate a 1 paragraph review of audience reception of "${gameName},' 
        then generate a second paragraph of how suitable "${gameName}" is to a Gamer who likes games with these specifications:  Genres:"(${genre})", Mode:"(${mode})", and likes these games:"(${games})".
        ( If these fields are empty say "Take out quiz to see how much this suites you!" instead of the second paragraphs). Strictly only respond with the given paragraphs with no additional text or formatting.`,
        options: { temperature: 0.8 },
      }),
    });
    
    const reader = response.body?.getReader();
    let serverResponse = '';
    let done = false;
    
    while (!done) {
      const { value, done: streamDone } = await reader.read();
      done = streamDone;
      if (value) {
        serverResponse += new TextDecoder('utf-8').decode(value);
      }
    }
    
    const jsonObjects = serverResponse.trim().split("\n").filter(line => line.trim() !== "");
    let completeResponse = "";
    for (const jsonObject of jsonObjects) {
      try {
        const data = JSON.parse(jsonObject);
        if (data.response) {
          completeResponse += data.response;
        }
        if (data.done) break;
      } catch (e) {
        console.error("Error parsing AI response:", e);
      }
    }
    
    return completeResponse;
  }
);

// redux/gameAIDetailsSlice.ts
interface GameAIState {
    description: string;
    review: string;
    loadingDescription: boolean;
    loadingReview: boolean;
    error: string | null;
  }
  
  const initialState: GameAIState = {
    description: '',
    review: '',
    loadingDescription: false,
    loadingReview: false,
    error: null,
  };
  
  const gameAIDetailsSlice = createSlice({
    name: 'gameAI',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(generateGameDescription.pending, (state) => {
          state.loadingDescription = true;
          state.error = null;
        })
        .addCase(generateGameDescription.fulfilled, (state, action) => {
          state.loadingDescription = false;
          state.description = action.payload;
        })
        .addCase(generateGameDescription.rejected, (state, action) => {
          state.loadingDescription = false;
          state.error = action.error.message || 'Failed to generate game description';
        })
        .addCase(generateGameReview.pending, (state) => {
          state.loadingReview = true;
          state.error = null;
        })
        .addCase(generateGameReview.fulfilled, (state, action) => {
          state.loadingReview = false;
          state.review = action.payload;
        })
        .addCase(generateGameReview.rejected, (state, action) => {
          state.loadingReview = false;
          state.error = action.error.message || 'Failed to generate game review';
        });
    },
  });
  
  export default gameAIDetailsSlice.reducer;
  