import { call, put, select } from 'redux-saga/effects';
import { GET_USERS } from '@/constants/constants';
import { getUsersSuccess } from '@/redux/actions/userActions';
import firebase from '@/services/firebase';

export function* fetchUsersSaga({ payload: lastRefKey }) {
  try {
    const state = yield select();
    
    const result = yield call(
      firebase.getUsers, 
      lastRefKey, 
      state.filter
    );
    
    yield put(getUsersSuccess({
      users: result.users,
      lastKey: result.lastKey,
      total: result.total
    }));
    
  } catch (error) {
    console.error('User fetch failed:', error);
  }
}