import { FETCH_USERS, SET_USER } from "./actionTypes";
import Axios from 'axios';


export const setUser = (payload) => {
    return {
        type: SET_USER,
        payload
    }
}

export const getUsers = async () => {
    return async (dispatch, getSTate) => {
        const response = await Axios.get('https://jsonplaceholder.typicode.com/posts');

        dispatch({
            type: FETCH_USERS,
            payload: response.data
        })
    }
}
