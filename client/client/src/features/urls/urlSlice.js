import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  urls: [],
  loading: false,
  creating: false,
  error: null,
};

export const fetchUrls = createAsyncThunk(
  "urls/fetchUrls",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/urls", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch URLs");
      }

      return data.urls;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const createShortUrl = createAsyncThunk(
  "urls/createShortUrl",
  async (originalUrl, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/urls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ originalUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create short URL");
      }

      return data.url;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const urlSlice = createSlice({
  name: "urls",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchUrls.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchUrls.fulfilled, (state, action) => {
        state.loading = false;
        state.urls = action.payload;
      })

      .addCase(fetchUrls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createShortUrl.pending, (state) => {
        state.creating = true;
        state.error = null;
      })

      .addCase(createShortUrl.fulfilled, (state, action) => {
        state.creating = false;
        state.urls.unshift(action.payload);
      })

      .addCase(createShortUrl.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      });
  },
});

export default urlSlice.reducer;
