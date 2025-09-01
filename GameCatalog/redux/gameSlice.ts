// gameSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Game {
  id: number;
  name: string;
  released: string;
  cover?: {
    url: string;
  };
}

interface GameState {
  selectedGameId: any;
  games: any[];
  filteredGames: any[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
}

const initialState: GameState = {
  games: [],
  filteredGames: [],
  loading: false,
  error: null,
  searchQuery: '',
  selectedGameId: undefined
};

export const fetchGames = createAsyncThunk('game/fetchGames', async () => {
  const response = await fetch(
    'https://api.rawg.io/api/games?key=b30ded59b0374ffa93def91fb369971f&page_size=25'
  );
  const data = await response.json();

  return data.results.map((game: any) => ({
    id: game.id,
    name: game.name,
    released: game.released,
    cover: {
      url: game.background_image,
    },
  }));
});

// Add a new thunk for search functionality
export const searchGames = createAsyncThunk('game/searchGames', async (query: string) => {
  const response = await fetch(
    `https://api.rawg.io/api/games?key=b30ded59b0374ffa93def91fb369971f&page_size=40&search=${query}&exclude_additions`
  );
  const data = await response.json();

  return data.results.map((game: any) => ({
    id: game.id,
    name: game.name,
    released: game.released,
    cover: {
      url: game.background_image,
    },
  }));
});

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setSelectedGameId: (state, action) => {
      state.selectedGameId = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.games = action.payload;
        state.filteredGames = action.payload; // Initialize filtered games
        state.loading = false;
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch games';
      })
      .addCase(searchGames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchGames.fulfilled, (state, action) => {
        state.filteredGames = action.payload; // Update filtered games with search results
        state.loading = false;
      })
      .addCase(searchGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to search games';
      });
  },
});

export const { setSelectedGameId, setSearchQuery } = gameSlice.actions;

export default gameSlice.reducer;
