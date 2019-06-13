import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';

import roomReducer from './Reducers/RoomReducer'
import notificationReducer from './Reducers/NotificationReducer'
import userReducer from './Reducers/UserReducer'
import usersReducer from './Reducers/UsersReducer'

const reducer = combineReducers({
  rooms: roomReducer,
  notification: notificationReducer,
  user: userReducer,
  users: usersReducer
})

const store = createStore(reducer, applyMiddleware(thunk))

export default store