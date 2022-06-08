import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchMyBlockers, fetchSettings, saveSettings } from "../utils/firebase";


export const blockUser = createAsyncThunk('auth/blockUser', (data, action) => {
    const currentUser = action.getState().auth.currentUser;
    return saveSettings(currentUser, data).then(results => {
        return data;
    })
})

export const fetchBlocked = createAsyncThunk('auth/fetchBlocked', (user) => {
    return fetchSettings(user).then(results => {
        return results.docs ? results.docs.map(doc => doc.data().blocked) : []
    })
})

export const fetchBlockers = createAsyncThunk('auth/fetchBlockers', (user, action) => {
    const currentUser = action.getState().auth.currentUser;
    return fetchMyBlockers(currentUser).then(results => {
        return results.docs ? results.docs.map(doc => doc.data().owner) : []
    })
})


const removeFromArray = (arr, value) => {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === value) {
            arr.splice(i, 1);
        }
    }
    return arr;
}

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        currentUser: {},
        blocked: [],
        blockedMe: [],
        loading: false,
        notify: false
    },
    reducers: {
        setUser(state, action) {
            state.currentUser = action.payload
        },
        removeNotify(state, action) {
            state.notify = false
        }
    },
    extraReducers: builder => {
        builder.addCase(blockUser.fulfilled, (state, action) => {
            const currentUserId = action.payload.user.sub || action.payload.user.user_id;
            if (action.payload.blocked) {
                state.blocked = removeFromArray([...state.blocked], currentUserId);
            } else {   
                if (!(currentUserId in state.blocked)) {
                    state.blocked.push(currentUserId);
                }
            }
            state.loading = false
            state.notify = true
        });
        builder.addCase(blockUser.pending, (state) => {
            state.loading = true
        });
        builder.addCase(fetchBlocked.fulfilled, (state, action) => {
            state.blocked = action.payload
        });
        builder.addCase(fetchBlockers.fulfilled, (state, action) => {
            state.blockedMe = action.payload
        });
    }
})

export default authSlice