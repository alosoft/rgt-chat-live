// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDoc, getDocs, doc, deleteDoc, setDoc, updateDoc, where, query } from "firebase/firestore";
import _ from 'lodash'

const firebaseConfig = {
    apiKey: "AIzaSyBfKtmAbTIIbNcljhbrBmNYYH9Rg8HkoNU",
    authDomain: "rgt-chat-app-a57ae.firebaseapp.com",
    projectId: "rgt-chat-app-a57ae",
    storageBucket: "rgt-chat-app-a57ae.appspot.com",
    messagingSenderId: "665734526572",
    appId: "1:665734526572:web:c4698401ee3c73a1710a49"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export const addData = async (message) => {
    try {
        return addDoc(collection(db, 'chats'), message);
    } catch (error) {
        console.log('error firebase ===>>>>>>>', error)
        return error;
    }
}

export const fetchSettings = (currentUser) => {
    try {
        const currentUserId = currentUser.sub || currentUser.user_id;
        return getDocs(query(collection(db, 'blocked'),
        where('owner', '==', currentUserId)
        ))
    } catch (error) {
        console.log('error fetching settings', error)
        return error;
    }
}

export const fetchMyBlockers = (currentUser) => {
    try {
        const currentUserId = currentUser.sub || currentUser.user_id;
        return getDocs(query(collection(db, 'blocked'),
        where('blocked', '==', currentUserId)
        ))
    } catch (error) {
        console.log('error fetching settings', error)
        return error;
    }
}

export const saveSettings = (currentUser, data) => {
    try {
        const blocked = data.user;
        const currentUserId = currentUser.sub || currentUser.user_id;
        const blockedId = blocked.sub || blocked.user_id;
        if (data.blocked) {
            return getDocs(query(collection(db, 'blocked'),
            where('blocked', '==', blockedId),
            where('owner', '==', currentUserId)
            )).then(results => {
                console.log('results fro blocked===========', results)
                if (results.docs.length > 0) {
                    return deleteDoc(doc(db, 'blocked', results.docs[0].id))
                }
                return []
            })
        } else {
            return addDoc(collection(db, 'blocked'), {
                owner: currentUserId,
                blocked: blockedId
            });
        }
    } catch (error) {
        console.log('error setting settings', error)
        return error;
    }
}

export const fetchData = async (currentUser, selectedUser) => {
    const currentUserId = currentUser.sub || currentUser.user_id;
    const currentSelectedUserId = selectedUser.sub || selectedUser.user_id;
    try {
        return getDocs(query(collection(db, 'chats'),
            where('sender', '==', currentUserId),
            where('receiver', '==', currentSelectedUserId)
        )).then(results => {
            return getDocs(query(collection(db, 'chats'),
                where('sender', '==', currentSelectedUserId),
                where('receiver', '==', currentUserId)
            )).then(result => {
                const chats = [
                    ...result.docs.map(doc => doc.data()),
                    ...results.docs.map(doc => doc.data())
                ];
                return _.sortBy(chats, 'date')

            })
        }).catch(error => {
            console.log('error in query', error);
            return Promise.reject(error.message)
        })
    } catch (error) {
        console.log('error quering ..', error)
        return error;
    }
}

export default app