const initialState = {
    user: null,
    loading: false,
    error: null,
};

// Action types
const LOGIN_START = 'auth/LOGIN_START';
const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
const LOGIN_FAILURE = 'auth/LOGIN_FAILURE';
const LOGOUT = 'auth/LOGOUT';

// Actions creators
export const loginStart = () => ({ type: LOGIN_START });
export const loginSuccess = (user) => ({ type: LOGIN_SUCCESS, payload: user });
export const loginFailure = (error) => ({ type: LOGIN_FAILURE, payload: error });
export const logout = () => ({ type: LOGOUT });

// Reducer
export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case LOGIN_START:
            return { ...state, loading: true, error: null };
        case LOGIN_SUCCESS:
            return { ...state, loading: false, user: action.payload };
        case LOGIN_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case LOGOUT:
            return { ...state, user: null };
        default:
            return state;
    }
}
