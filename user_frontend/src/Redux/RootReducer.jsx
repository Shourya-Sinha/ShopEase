import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import AppReducer from './Slices/InitialSlice.jsx';
import AuthReducer from './Slices/AuthSlice.jsx';
import ProductReducer from './Slices/ProductSlice.jsx';

const rootPersistConfig={
    key: 'root',
    storage,
    keyPrefix:'redux-',
    whitelist: ['cart','auth','app','appData'],
}

const rootReducer = combineReducers({
    app:AppReducer,
    auth:AuthReducer,
    appData:ProductReducer,
    // Your reducers here
});

export {rootPersistConfig,rootReducer};