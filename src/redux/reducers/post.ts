import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { IUSER } from "./user";

// Define a type for the slice state
export interface IPOST {
  ID: string | number;
  title: string;
  body: string;
  userid: number | string;
  CreatedAt: string;
  UpdatedAt: string;
  likes: ILIKES[];
  User: IUSER;
}
export interface ILIKES {
  ID: string;
  userid: string;
  posts: string;
}

export const fetchPosts = createAsyncThunk(
  "posts/getposts",
  async ()=> {
    try {

      const { data } = await axios.get(`${process.env.REACT_APP_URL}/getposts`);

      if (!data.error) {
        return data;
      }

      throw new Error("No posts Found");
    } catch (error) {
      return error.message
      
      
    }
  }
);

// Define the initial state using that type
const initialState: { loading: boolean; posts: IPOST[]|null } = {
  loading: false,
  posts: null,
};

export const postsSlice = createSlice({
  name: "posts",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    SetPosts: (state, { payload }: PayloadAction<IPOST[]>) => {
      state.loading = false;
      state.posts = payload;
    },

    RemovePost: (state, action: PayloadAction<any>) => {
      state.loading = true;

      state.posts = state.posts.filter(
        (e) => e.ID !== parseInt(action.payload)
      );
      state.loading = false;
    },

    EditPost: (state, action: PayloadAction<IPOST>) => {
      const index = state.posts.findIndex((e) => {
       return e.ID === action.payload.ID;
      });
      
      state.posts[index] = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchPosts.fulfilled, (state, { payload }) => {
      state.loading = false;
      
      if (typeof payload !== "string") {
        state.posts = payload as IPOST[];
      }
    });
    builder.addCase(fetchPosts.rejected, (state, action) => {
      state.loading = false;
      state.posts= null
    });
  },
});

export const { RemovePost, SetPosts,EditPost } = postsSlice.actions;

export default postsSlice.reducer;
