import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addData, fetchData } from '../utils/firebase';

function createRoom(message) {
    return `${message.sender}-${message.receiver}`;
}
function createRoom2(message) {
    return `${message.receiver}-${message.sender}`;
}

export const storeChat = createAsyncThunk('chat/storeChat', (message) => {
    return addData(message).then(results => {
        return message;
    })
})

export const setSelectedUser = createAsyncThunk('chat/fetchChat', (user, action) => {
    const currentUser = action.getState().auth.currentUser;
    return fetchData(currentUser, user).then(results => {
        return {
            user,
            chats: results
        };
    })
})



const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        selectedUser: JSON.parse(localStorage.getItem('SELECTED_USER') || '{}'),
        chats: [],
        onlineUsers: JSON.parse(localStorage.getItem('ONLINE_USERS') || '[]'),
        rooms: {},
        saving: false,
        error: '',
        loading: false,
        showMenu: false
    },
    reducers: {
        setSelectedUser(state, action) {
            state.selectedUser = action.payload
        },
        addChat(state, action) {
            const room = createRoom(action.payload);
            const room2 = createRoom2(action.payload);
            if (room in state.rooms) {
                state.rooms[room].push(action.payload)
            } else if (room2 in state.rooms) {
                state.rooms[room2].push(action.payload)
            } else {
                state.rooms[room] = [action.payload]
            }
        },
        setOnlineUser(state, action) {
            state.onlineUsers.push(action.payload)
            localStorage.setItem('ONLINE_USERS', JSON.stringify([...state.onlineUsers]))
        },
        blockedChat(state, action) {
            const blockedUserId = action.payload
            const selectedUserId = state.selectedUser.user_id || state.selectedUser.sub;
            if (selectedUserId === blockedUserId) {
                localStorage.removeItem('SELECTED_USER')
                state.selectedUser = {}
            }
        },
        setMenuVisibility(state, action) {
            state.showMenu = action.payload
        }
    },
    extraReducers: builder => {
        builder.addCase(storeChat.pending, state => {
            state.saving = true
        });
        builder.addCase(storeChat.rejected, state => {
            state.saving = false
            state.error = 'Failed to store chat'
        });
        builder.addCase(storeChat.fulfilled, (state, action) => {
            const room = createRoom(action.payload);
            const room2 = createRoom2(action.payload);
            if (room in state.rooms) {
                state.rooms[room].push(action.payload)
            } else if (room2 in state.rooms) {
                state.rooms[room2].push(action.payload)
            } else {
                state.rooms[room] = [action.payload]
            }
            state.saving = false;
            state.error = '';
        });
        builder.addCase(setSelectedUser.pending, state => {
            state.loading = true
        });
        builder.addCase(setSelectedUser.rejected, state => {
            state.loading = false
            state.error = 'Failed to store chat'
        });
        builder.addCase(setSelectedUser.fulfilled, (state, action) => {
            const user = action.payload.user;
            localStorage.setItem('SELECTED_USER', JSON.stringify(user))
            state.selectedUser = user;
            if (action.payload.chats.length > 0) {
                const chats = action.payload.chats;
                const room = createRoom(chats[0]);
                const room2 = createRoom2(chats[0]);
                if (room in state.rooms) {
                    state.rooms[room].push.apply(state.rooms[room], chats)
                } else if (room2 in state.rooms) {
                    state.rooms[room2].push.apply(state.rooms[room2], chats)
                } else {
                    state.rooms[room] = chats
                }
            }
            state.loading = false;
            state.error = '';
        })
    }
})

export default chatSlice;