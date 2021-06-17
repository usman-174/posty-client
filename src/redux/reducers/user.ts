import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { IPOST } from "./post";

// Define a type for the slice state
export interface IUSER {
  loading: boolean;
  username: string;
  email: string;
  id: number | string;
  posts: IPOST[];
  postsLoading: boolean;
}
export interface ILOGIN {
  email: string;
  password: string;
}

export const GetUser = createAsyncThunk(
  "users/getuser",
  async (): Promise<any> => {
    try {
      const { data } = await axios.get(`/x/user`);

      if (!data.error) {
        return {
          username: data.username,
          email: data.email,
          id: data.ID,
          posts: data.posts,
        };
      }

      throw new Error("false");
    } catch (error) {
      return false;
    }
  }
);
export const SetMyPosts = createAsyncThunk("users/setposts", async () => {
  try {
    const { data } = await axios.get(`/x/myposts`);

    if (!data.error && data) {
      return data;
    }

    throw new Error(data.error);
  } catch (error) {
    return error.message;
  }
});

// Define the initial state using that type
const initialState: IUSER = {
  username: null,
  loading: false,
  email: null,
  id: null,
  posts: [],
  postsLoading: false,
};

export const userSlice = createSlice({
  name: "users",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    AddUser: (
      state,
      action: PayloadAction<{ email: string; username: string; ID: number }>
    ) => {
      state.email = action.payload.email;
      state.id = action.payload.ID;
      state.username = action.payload.username;
    },
    RemoveMyPost: (state, action: PayloadAction<any>) => {
      state.postsLoading = true;

      state.posts = state.posts.filter(
        (e) => e.ID !== parseInt(action.payload)
      );
      state.postsLoading = false;
    },
    RemoveUser: (state) => {
      state.username = null;
      state.loading = false;
      state.email = null;
      state.id = null;
      state.posts = [];
      state.postsLoading = false;
    },
    UpdatePosts: (state, action: PayloadAction<IPOST[]>) => {
      state.posts = action.payload;
    },
  },
  extraReducers: (builder) => {
    // GET USER BUILDER ---------------------------------------------------
    builder.addCase(GetUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      GetUser.fulfilled,
      (state, action: PayloadAction<IUSER>) => {
        if (action.payload) {
          state.email = action.payload.email;
          state.username = action.payload.username;
          state.id = action.payload.id;
          state.posts = action.payload.posts;
        }
        state.loading = false;
      }
    );
    builder.addCase(GetUser.rejected, (state, action) => {
      state.loading = false;
    });

    // POSTS BUILDER ----------------------------------------------------
    builder.addCase(SetMyPosts.pending, (state) => {
      state.postsLoading = true;
    });
    builder.addCase(
      SetMyPosts.fulfilled,
      (state, action: PayloadAction<IPOST[]>) => {
        state.posts = action.payload;
        state.postsLoading = false;
      }
    );
    builder.addCase(SetMyPosts.rejected, (state, action) => {
      state.postsLoading = false;
    });
  },
});

export const { AddUser, RemoveUser, RemoveMyPost, UpdatePosts } =
  userSlice.actions;

export default userSlice.reducer;
