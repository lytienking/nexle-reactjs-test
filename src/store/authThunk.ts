import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from 'store';
import type { LoginCredentials, SignupCredentials } from 'types/auth';
import api from 'services/api';
import { AxiosError } from 'axios';

export const login = createAsyncThunk(
  'auth/signin',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/signin', credentials);
      const { accessToken, refreshToken, user } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      return { accessToken, refreshToken, user };
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || 'Signin failed');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (credentials: SignupCredentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post('/auth/signup', credentials);
      const user = response.data;
      await dispatch(
        login({ email: credentials.email, password: credentials.password })
      ).unwrap();
      return user;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || 'Signup failed');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state: RootState = getState() as RootState;
      const refreshToken = state.auth.refreshToken || localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No token found');

      await api.post('/auth/signout', { refreshToken });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return true;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || 'Signout failed');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);