import { ADD_USER, DELETE_USER, EDIT_USER,  GET_USERS_SUCCESS  } from '@/constants/constants';

// const initState = [
//   {
//     firstname: 'Gago',
//     lastname: 'Ka',
//     email: 'gagoka@mail.com',
//     password: 'gagooo',
//     avatar: '',
//     banner: '',
//     dateJoined: 0
//   }
// ];
const initialState = {
  items: [],       // Array of users (replaces your old array state)
  lastRefKey: null, // For pagination
  total: 0         // Total users count
};

export default (state = {}, action) => {
  switch (action.type) {
    case GET_USERS_SUCCESS:
      return {
        ...state,
        items: [...state.items, ...action.payload.users],
        lastRefKey: action.payload.lastKey,
        total: action.payload.total
      }
    case ADD_USER:
      return [...state, action.payload];
    case EDIT_USER:
      return state.map((user) => {
        if (user.id === action.payload.id) {
          return {
            ...user,
            ...action.payload
          };
        }
        return user;
      });
    case DELETE_USER:
      return state.filter((user) => user.id !== action.payload);
    default:
      return state;
  

    }
};
