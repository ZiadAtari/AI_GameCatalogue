// redux/gameDetailSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface GameDetail {
  id: number;
  slug: string;
  name: string;
  name_original: string;
  description: string;
  metacritic: number;
  metacritic_platforms: Array<{ metascore: number; url: string }>;
  released: string;
  tba: boolean;
  updated: string;
  background_image: string;
  background_image_additional: string;
  website: string;
  rating: number;
  rating_top: number;
  ratings: Record<string, any>;
  reactions: Record<string, any>;
  added: number;
  added_by_status: Record<string, any>;
  playtime: number;
  screenshots_count: number;
  movies_count: number;
  creators_count: number;
  achievements_count: number;
  parent_achievements_count: string;
  reddit_url: string;
  reddit_name: string;
  reddit_description: string;
  reddit_logo: string;
  reddit_count: number;
  twitch_count: string;
  youtube_count: string;
  reviews_text_count: string;
  ratings_count: number;
  suggestions_count: number;
  alternative_names: string[];
  metacritic_url: string;
  parents_count: number;
  additions_count: number;
  game_series_count: number;
  esrb_rating: {
    id: number;
    slug: string;
    name: string;
  };
  platforms: Array<{
    platform: {
      id: number;
      slug: string;
      name: string;
    };
    released_at: string;
    requirements: {
      minimum: string;
      recommended: string;
    };
  }>;
}

interface GameDetailState {
  detail: GameDetail | null;
  loading: boolean;
  error: string | null;
}

const initialState: GameDetailState = {
  detail: null,
  loading: false,
  error: null,
};

export const fetchGameDetail = createAsyncThunk(
  'gameDetail/fetchGameDetail',
  async (gameId: number) => {
    const response = await fetch(`https://api.rawg.io/api/games/${gameId}?key=b30ded59b0374ffa93def91fb369971f`);
    if (!response.ok) {
      throw new Error('Failed to fetch game details');
    }
    return response.json();
  }
);

const gameDetailSlice = createSlice({
  name: 'gameDetail',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGameDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGameDetail.fulfilled, (state, action) => {
        state.detail = action.payload;
        state.loading = false;
      })
      .addCase(fetchGameDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch game details';
      });
  },
});

export default gameDetailSlice.reducer;
