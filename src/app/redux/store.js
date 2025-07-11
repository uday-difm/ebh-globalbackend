import { configureStore } from '@reduxjs/toolkit'
import authReducer from './reducers/authReducer'
import blogReducer from './reducers/blogReducer'

export const store = configureStore({
  reducer: {
    auth:authReducer,
    blogData: blogReducer,
  },
})