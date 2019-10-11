import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk';

import roomReducer from './reducers/RoomReducer'
import roomsReducer from './reducers/RoomsReducer'
import notificationReducer from './reducers/NotificationReducer'
import userReducer from './reducers/UserReducer'
import usersReducer from './reducers/UsersReducer'
import letterReducer from './reducers/LetterReducer'
import speakingReducer from './reducers/SpeakingReducer'
import messageReducer from './reducers/MessageReducer'
import chatnickReducer from './reducers/ChatnickReducer';
import privateRoomsReducer from './reducers/PrivateRoomsReducer';
import inviteStatusReducer from './reducers/InviteStatusReducer';
import invitesReducer from './reducers/InvitesReducer';
import ownFaceReducer from './reducers/OwnFaceReducer';
import userInfoReducer from './reducers/UserInfoReducer';
import windowSizeReducer from './reducers/WindowSizeReducer';

const reducer = combineReducers({
  rooms: roomsReducer,
  privateRooms: privateRoomsReducer,
  room: roomReducer,
  notification: notificationReducer,
  user: userReducer,
  users: usersReducer,
  letter: letterReducer,
  speaking: speakingReducer,
  message: messageReducer,
  chatnick: chatnickReducer,
  inviteStatus: inviteStatusReducer,
  invites: invitesReducer,
  faces: ownFaceReducer,
  userInfo: userInfoReducer,
  windowSize: windowSizeReducer
})

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))

export default store