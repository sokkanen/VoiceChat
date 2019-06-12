import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';

//import var1Reducer from './reducers/var1Reducer'
//import var2Reducer from './reducers/var2Reducer'

const reducer = combineReducers({
  variable1: null,
  variable2: null,
})

const store = createStore(reducer, applyMiddleware(thunk))

export default store