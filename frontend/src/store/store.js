import { configureStore } from '@reduxjs/toolkit';
import reducer from './authSlice';
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'
import thunk from 'redux-thunk';
import usersSlice from './usersSlice';
import chatSlice from './chatSlice';

const persistConfig = {
    key: 'root',
    storage
};

// const persistedReducer = persistReducer(persistConfig, reducer);


const store = configureStore({
    reducer: {
        auth: reducer.reducer,
        users: usersSlice.reducer,
        chat: chatSlice.reducer
    }
})

export default store;