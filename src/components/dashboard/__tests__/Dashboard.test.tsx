import '@testing-library/jest-dom';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Dashboard from '../Dashboard';
import authReducer from 'store/authSlice';
import type { AuthState } from 'types/auth';
import * as reactRedux from 'react-redux';
import type { Dispatch } from 'redux';

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer
    },
    preloadedState: {
      auth: {
        user: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com'
        },
        loading: false,
        error: null,
        accessToken: 'mock-token',
        refreshToken: 'mock-refresh-token',
        isAuthenticated: true,
        ...initialState
      } as AuthState
    }
  });
};

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const mockDispatch = jest.fn(() => ({ unwrap: () => Promise.resolve() }));

beforeAll(() => {
  jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch as unknown as Dispatch);
});

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

describe('Dashboard Component', () => {
  const renderComponent = (initialState = {}) => {
    const store = createMockStore(initialState);
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockDispatch.mockClear();
  });

  it('renders user information correctly', () => {
    renderComponent();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Available')).toBeInTheDocument();
  });

  it('toggles menu when clicking avatar', () => {
    renderComponent();
    const avatar = screen.getByAltText('avatar');
    
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
    
    fireEvent.click(avatar);
    expect(screen.getByText('Logout')).toBeInTheDocument();
    
    fireEvent.click(avatar);
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  it('closes menu when clicking outside', () => {
    renderComponent();
    const avatar = screen.getByAltText('avatar');
    
    fireEvent.click(avatar);
    expect(screen.getByText('Logout')).toBeInTheDocument();
    
    fireEvent.mouseDown(document.body);
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  it('handles logout correctly', async () => {
    renderComponent();
    const avatar = screen.getByAltText('avatar');
    
    fireEvent.click(avatar);
    const logoutButton = screen.getByText('Logout');
    await act(async () => {
      fireEvent.click(logoutButton);
    });
    
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('shows loading state during logout', () => {
    renderComponent({ loading: true });
    const avatar = screen.getByAltText('avatar');
    
    fireEvent.click(avatar);
    expect(screen.getByText('Logging out...')).toBeInTheDocument();
  });

  it('renders dashboard content correctly', () => {
    renderComponent();
    expect(screen.getByText('Welcome to Demo App')).toBeInTheDocument();
    expect(screen.getByAltText('Dashboard Illustration')).toBeInTheDocument();
    expect(screen.getByText('COPYRIGHT © 2020')).toBeInTheDocument();
  });
}); 