import { AsyncStorage } from 'react-native';

export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

let timer;


export const authenticate = (userId, token, expiryTime) => {
    return dispatch => {
        dispatch(setLogoutTimer(expiryTime));
        dispatch({ type: AUTHENTICATE, userId: userId, token: token });
    }
};

export const signup = (email, password) => {
    return async dispatch => {
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD7uVW6cM2fvDMKEOZbx4O9XFxMxW8k2WA',
            {
                method: 'POST',
                header: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            });
        if (!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            let message = 'Something went wrong in CorpTut auth Services';
            if (errorId === 'EMAIL_EXISTS') {
                message = 'This email exists already';
            }
            throw new Error(message);
        }


        //convert json to javascript object
        const resData = await response.json();
        console.log(resData);
        dispatch(
            authenticate(
                restdata.localId,
                resData.idToken,
                parseInt(resData.expiresIn) * 1000
            )
        );
        const expirationDate = new Date(
            new Date().getTime() + parseInt(resData.expiresIn) * 1000
        );
        saveDataToStorage(resData.idToken, resData.localId);
    };
};



export const login = (email, password) => {
    return async dispatch => {
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD7uVW6cM2fvDMKEOZbx4O9XFxMxW8k2WA',
            {
                method: 'POST',
                header: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            });
        if (!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            let message = 'Something went wrong in CorpTut auth Services';
            if (errorId === 'EMAIL_NOT_FOUND') {
                message = 'This email could not be found!';
            } else if (errorId === 'INVALID_PASSWORD') {
                message = 'This password is incorrect!';
            }
            throw new Error(message);
        }


        //convert json to javascript object
        const resData = await response.json();
        console.log(resData);
        dispatch(
            authenticate(
                resData.localId,
                resData.idToken,
                parseInt(resData.expiresIn) * 1000
            )
        );
        //dispatch({type: LOGIN, token: resData.idToken, userId: resData.localId });
        const expirationDate = new Date(
            new Date().getTime() + parseInt(resData.expiresIn) * 1000
        );
        saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    };
};


export const logout = () => {
    return dispatch => {
        clearLogoutTimer();
        AsyncStorage.removeItem('userData');
        return { type: LOGOUT };
    }
};

/* 
* when we do logout we want to clear any running timer
* clearTimeout() is built-in function of JS, used to get rid of timer
*/
const clearLogoutTimer = () => {
    if (timer) {
        clearTimeout(timer);
    }

};

/*
* setTimeout will dispatch an action logout() after expirationTime
* The inner function setTimeout gets dispatched as an argument,
* and therefore once this async task finishes(timer expired) 
* we can dispatch logout()
* we can dispatch the result of logout() action creator which is 
* return { type: LOGOUT }, this action in the end
*/
const setLogoutTimer = expirationTime => {
    return dispatch => {
        timer = setTimeout(() => {
            dispatch(logout());
        }, expirationTime);
    };
};



const saveDataToStorage = (token, userId, expirationDate) => {
    AsyncStorage.setItem(
        'userData',
        JSON.stringify({
            token: token,
            userId: userId,
            expiryDate: expirationDate.toISOString()
        })
    );
}