import { SET_AUTH, EDIT_USER, LOGOUT } from "../actions/action";

const initialState = {
  isAuthenticated: false,
  userId: null,
  name: '',
  username: '',
  role: '',
  profile: '',
  profession:'',
  email:'',
  bio:'',
  error: '',
  user: [],
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {

    case EDIT_USER:
      return {
        ...state,
        user: action.payload,
      };

    case SET_AUTH:
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        userId: action.payload.userId,
        name:action.payload.name,
        profile:action.payload.profile,
        username:action.payload.username,
        profession:action.payload.profession,
        email:action.payload.email,
        bio:action.payload.bio,
      };

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
};

export default authReducer;
