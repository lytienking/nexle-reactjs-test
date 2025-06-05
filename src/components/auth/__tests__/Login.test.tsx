import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Login from '../Login';
import authReducer from '../../../store/authSlice';
import type { AuthState } from '../../../types/auth';
import * as reactRedux from 'react-redux';
import type { Dispatch } from 'redux';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockDispatch = jest.fn(() => ({ unwrap: () => Promise.resolve() }));

beforeAll(() => {
  jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch as unknown as Dispatch);
});
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

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
      },
    },
  });
};

const renderLogin = (initialState: Partial<AuthState> = {}) => {
  const store = createMockStore(initialState);
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </Provider>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form correctly', async () => {
    await act(async () => {
      renderLogin();
    });
    
    expect(screen.getByText('Welcome to ReactJs Test Interview!')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/remember me/i)).toBeInTheDocument();
  });

  it('shows validation errors for invalid form submission', async () => {
    await act(async () => {
      renderLogin();
    });
    
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    await act(async () => {
      fireEvent.click(loginButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid email format', async () => {
    await act(async () => {
      renderLogin();
    });
    
    const emailInput = screen.getByLabelText(/email/i);
    
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.blur(emailInput);
    });

    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  it("should navigate to /dashboard after successful login", async () => {
    await act(async () => {
      renderLogin();
    });

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
    });

    await act(async () => {
      fireEvent.click(loginButton);
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    }, { timeout: 3000 });
  });


  it('displays loading state during login', async () => {
    await act(async () => {
      renderLogin({ loading: true });
    });
    
    expect(screen.getByRole('button', { name: /login/i })).toBeDisabled();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  it('displays error message when login fails', async () => {
    const errorMessage = 'Invalid credentials';
    await act(async () => {
      renderLogin({ error: errorMessage });
    });
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('handles remember me checkbox', async () => {
    await act(async () => {
      renderLogin();
    });
    
    const rememberCheckbox = screen.getByLabelText(/remember me/i);
    expect(rememberCheckbox).not.toBeChecked();
    
    await act(async () => {
      fireEvent.click(rememberCheckbox);
    });
    
    expect(rememberCheckbox).toBeChecked();
  });

  it('disables form inputs during loading', async () => {
    await act(async () => {
      renderLogin({ loading: true });
    });
    
    expect(screen.getByLabelText(/email/i)).toBeDisabled();
    expect(screen.getByLabelText(/password/i)).toBeDisabled();
    expect(screen.getByLabelText(/remember me/i)).toBeDisabled();
  });
}); 

