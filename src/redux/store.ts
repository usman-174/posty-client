import  post from './reducers/post';
import { configureStore } from '@reduxjs/toolkit'
import user from './reducers/user'
// ...

export const store = configureStore({
  reducer: {
      user,
      post 
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch