import React, { createContext, useContext, useReducer, useEffect } from 'react';
import API from '../utils/api';

const AuthContext = createContext();

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  loading: false,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      return { ...state, user: action.payload.user, token: action.payload.token, loading: false };
    case 'UPDATE_USER':
      const updated = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(updated));
      return { ...state, user: updated };
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { user: null, token: null, loading: false };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Refresh user data on mount
  useEffect(() => {
    if (state.token) {
      API.get('/auth/me')
        .then(({ data }) => dispatch({ type: 'UPDATE_USER', payload: data.user }))
        .catch(() => dispatch({ type: 'LOGOUT' }));
    }
  }, []);

  const login = async (credentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    const { data } = await API.post('/auth/login', credentials);
    dispatch({ type: 'LOGIN_SUCCESS', payload: data });
    return data;
  };

  const register = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    const { data } = await API.post('/auth/register', userData);
    dispatch({ type: 'LOGIN_SUCCESS', payload: data });
    return data;
  };

  const logout = () => dispatch({ type: 'LOGOUT' });

  const updateUser = (data) => dispatch({ type: 'UPDATE_USER', payload: data });

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};