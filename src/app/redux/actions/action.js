import axios from 'axios';
import { serverUrl } from '../../../common/serverUrl';

export const SET_AUTH = 'SET_AUTH';
export const POST_CATEGORY = 'POST_CATEGORY';
export const POST_ADDEMPLOYEE = 'POST_ADDEMPLOYEE';
export const GET_CATEGORY = 'GET_CATEGORY';
export const GET_BLOG = 'GET_BLOG';
export const EDIT_USER = 'EDIT_USER';
export const GET_INDIVIDUAL_BLOG = 'GET_INDIVIDUAL_BLOG';
export const EDIT_INDIVIDUAL_BLOG = 'EDIT_INDIVIDUAL_BLOG';
// actionTypes.js
export const FETCH_BLOGS_REQUEST = 'FETCH_BLOGS_REQUEST';
export const FETCH_BLOGS_SUCCESS = 'FETCH_BLOGS_SUCCESS';
export const FETCH_BLOGS_FAILURE = 'FETCH_BLOGS_FAILURE';


// =============================== authenticate login admin ========================================//

export const setAuth = (isAuthenticated, userId, name, profile, username, profession, email, bio  ) => ({
    type: SET_AUTH,
    payload: { isAuthenticated, userId, name, profile, username, profession, email, bio },
  });


  //============================== Edit Admin Action Creator=============================
  export const editUserProfile = (id, updatedData) => async (dispatch) => {
    try {
      // Create a FormData object to handle file uploads
      const formData = new FormData();
      for (const key in updatedData) {
        formData.append(key, updatedData[key]);
      }
  
      // Send the PUT request with the FormData
      const response = await axios.put(`${serverUrl}/user/update-user/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      dispatch({ type: EDIT_USER, payload: response.data });
      alert('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user');
    }
  };



  export const fetchBlogsRequest = () => ({
    type: FETCH_BLOGS_REQUEST,
  });
  
  export const fetchBlogsSuccess = (blogs) => ({
    type: FETCH_BLOGS_SUCCESS,
    payload: blogs,
  });
  
  export const fetchBlogsFailure = (error) => ({
    type: FETCH_BLOGS_FAILURE,
    payload: error,
  });
  
  export const fetchBlogs = () => async (dispatch) => {
    dispatch(fetchBlogsRequest());
    try {
      const response = await axios.get(`${serverUrl}/blog/fetchblog`);
      dispatch(fetchBlogsSuccess(response.data));
    } catch (error) {
      dispatch(fetchBlogsFailure(error.message));
    }
  };
