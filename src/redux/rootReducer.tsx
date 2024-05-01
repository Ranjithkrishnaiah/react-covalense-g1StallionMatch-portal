import { combineReducers } from 'redux';
import reportSliceReducer from './actionReducers/reportSlice';
import userSliceReducer from './actionReducers/userSlice';
import storage from 'redux-persist/lib/storage';
import { splitApi } from './rootMiddleware';
// import API_OUTPUT from './services/general';
// import { API_INPUT } from './services/general';
// type ReturnObject = Record<string,any>
// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

// let key : keyof typeof API_INPUT;
// let returnObject: ReturnObject = {}
// function createReducerObject(){
//   for(key in API_INPUT){
//     returnObject[API_INPUT[key].reducerPath] = API_OUTPUT[key].reducer;
//   }
//   console.log("Return Object Inside", returnObject)
// }
// createReducerObject()
// console.log("Return Object", returnObject)
// const rootReducer = combineReducers({
//   [splitApi.reducerPath]: splitApi.reducer,
// });
const rootReducer = combineReducers({
  [splitApi.reducerPath]: splitApi.reducer,
  reportSlices: reportSliceReducer,
  userSlices: userSliceReducer,
});

export { rootPersistConfig, rootReducer };
