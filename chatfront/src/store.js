import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';

import roomReducer from './Reducers/RoomReducer'

//import var2Reducer from './reducers/var2Reducer'

const reducer = combineReducers({
  rooms: roomReducer,
  variable2: null,
})

const store = createStore(reducer, applyMiddleware(thunk))

export default store