import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
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

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))

export default store