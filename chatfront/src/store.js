import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk';

import roomReducer from './Reducers/RoomReducer'
import roomsReducer from './Reducers/RoomsReducer'
import notificationReducer from './Reducers/NotificationReducer'
import userReducer from './Reducers/UserReducer'
import usersReducer from './Reducers/UsersReducer'
import letterReducer from './Reducers/LetterReducer'
import speakingReducer from './Reducers/SpeakingReducer'
import messageReducer from './Reducers/MessageReducer'

const reducer = combineReducers({
  rooms: roomsReducer,
  room: roomReducer,
  notification: notificationReducer,
  user: userReducer,
  users: usersReducer,
  letter: letterReducer,
  speaking: speakingReducer,
  message: messageReducer
})

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))

export default store