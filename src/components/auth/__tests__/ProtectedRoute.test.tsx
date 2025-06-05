import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import ProtectedRoute from '../ProtectedRoute';
import authReducer from 'store/authSlice';
import type { AuthState } from 'types/auth';

const createMockStore = (initialState: Partial<AuthState> = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        user: null,
        accessToken: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        refreshToken: null,
        ...initialState,
      } as AuthState,
    },
  });
};

const renderWithRouter = (initialState: Partial<AuthState> = {}) => {
  const store = createMockStore(initialState);
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div data-testid="protected-content">Protected Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe('ProtectedRoute Component', () => {
  it('redirects to login page when user is not authenticated', () => {
    renderWithRouter({ isAuthenticated: false });
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('renders children when user has access token', () => {
    renderWithRouter({ 
      isAuthenticated: true,
      accessToken: 'valid-token',
      user: {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      }
    });
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });
}); 