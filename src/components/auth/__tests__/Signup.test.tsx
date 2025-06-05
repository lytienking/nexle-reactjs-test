import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Signup from '../Signup';
import authReducer from 'store/authSlice';
import type { AuthState } from 'types/auth';
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
      } as AuthState,
    },
  });
};

const renderSignup = (initialState: Partial<AuthState> = {}) => {
  const store = createMockStore(initialState);
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    </Provider>
  );
};

describe('Signup Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders signup form correctly', () => {
    renderSignup();
    
    expect(screen.getByLabelText(/firstname/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/lastname/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    renderSignup();
    
    const firstNameInput = screen.getByLabelText(/Firstname/i);
    fireEvent.change(firstNameInput, { target: { value: '' } });
    fireEvent.blur(firstNameInput);

    await waitFor(() => {
      expect(screen.getByText(/First name is required/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid email', async () => {
    renderSignup();
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText(/Invalid email format/i)).toBeInTheDocument();
    });
  });

  it('disables submit button when form is invalid', () => {
    renderSignup();
    
    const submitButton = screen.getByRole('button', { name: /sign up/i });
    expect(submitButton).toBeDisabled();
  });

  it('shows loading state during form submission', async () => {
    renderSignup({ loading: true });
    
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  it('displays error message when signup fails', () => {
    const errorMessage = 'Signup failed';
    renderSignup({ error: errorMessage });
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('navigates to dashboard after successful signup', async () => {
    renderSignup();
    
    // Fill in the form with valid data
    fireEvent.change(screen.getByLabelText(/firstname/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/lastname/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'StrongPass123!' } });
    fireEvent.click(screen.getByRole('checkbox'));

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
}); 