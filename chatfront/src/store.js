import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';

import roomReducer from './Reducers/RoomReducer'
import notificationReducer from './Reducers/NotificationReducer'

const reducer = combineReducers({
  rooms: roomReducer,
  notification: notificationReducer,
})

const store = createStore(reducer, applyMiddleware(thunk))

export default store