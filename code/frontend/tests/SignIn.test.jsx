import React from 'react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import SignIn from '../src/pages/Auth/SignIn/SignIn';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useLogin } from '../src/hooks/Auth/useLogin';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock('@react-oauth/google', () => ({
  useGoogleLogin: vi.fn(),
}));

vi.mock('../src/hooks/Auth/useLogin', () => ({
  useLogin: vi.fn(),
}));

// Mock FontAwesome
vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, className }) => (
    <span data-testid="font-awesome-icon" className={className}>
      {icon.iconName || 'icon'}
    </span>
  ),
}));

describe('SignIn Component', () => {
  let mockNavigate;
  let mockLogin;
  let mockGoogleLogin;

  beforeEach(() => {
    mockNavigate = vi.fn();
    mockLogin = vi.fn();
    mockGoogleLogin = vi.fn();

    useNavigate.mockReturnValue(mockNavigate);
    useLogin.mockReturnValue({
      login: mockLogin,
      error: null,
      isLoading: false,
    });
    useGoogleLogin.mockImplementation((config) => {
      mockGoogleLogin.onSuccess = config.onSuccess;
      mockGoogleLogin.onError = config.onError;
      return mockGoogleLogin;
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderSignIn = () => {
    return render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );
  };

  describe('Component Structure', () => {
    it('should render the main section with correct class', () => {
      renderSignIn();
      const section = document.querySelector('section.SignIn');
      expect(section).toBeInTheDocument();
    });

    it('should render the header with app name', () => {
      renderSignIn();
      const header = screen.getByRole('heading', { 
        level: 1, 
        name: 'MY MAGICAL BEDTIME' 
      });
      expect(header).toBeInTheDocument();
    });

    it('should render welcome heading', () => {
      renderSignIn();
      const heading = screen.getByRole('heading', { 
        level: 2, 
        name: 'Welcome!' 
      });
      expect(heading).toBeInTheDocument();
    });

    it('should render the illustration image', () => {
      renderSignIn();
      const image = screen.getByAltText('Illustration');
      expect(image).toBeInTheDocument();
      expect(image).toHaveClass('signin-image');
    });
  });

  describe('Form Elements', () => {
    it('should render all input fields', () => {
      renderSignIn();
      
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    });

    it('should render submit button', () => {
      renderSignIn();
      const submitButton = screen.getByRole('button', { name: 'SIGN IN' });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('should render Google sign-in button', () => {
      renderSignIn();
      const googleButton = screen.getByRole('button', { name: /Continue with Google/i });
      expect(googleButton).toBeInTheDocument();
    });

    it('should render sign up link', () => {
      renderSignIn();
      const signUpLink = screen.getByRole('link', { name: 'Sign up' });
      expect(signUpLink).toBeInTheDocument();
      expect(signUpLink).toHaveAttribute('href', '/signup');
    });
  });

  describe('Password Visibility Toggle', () => {
    it('should initially show password as hidden', () => {
      renderSignIn();
      const passwordInput = screen.getByPlaceholderText('Password');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should toggle password visibility when eye icon is clicked', async () => {
      renderSignIn();
      const user = userEvent.setup();
      const passwordInput = screen.getByPlaceholderText('Password');
      const toggleIcon = passwordInput.parentElement.querySelector('.toggle-icon');

      // Initially password should be hidden
      expect(passwordInput).toHaveAttribute('type', 'password');

      // Click to show password
      await user.click(toggleIcon);
      expect(passwordInput).toHaveAttribute('type', 'text');

      // Click to hide password again
      await user.click(toggleIcon);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Form Submission', () => {
    it('should call login with form data on submit', async () => {
      renderSignIn();
      const user = userEvent.setup();

      await user.type(screen.getByPlaceholderText('Email'), 'test@example.com');
      await user.type(screen.getByPlaceholderText('Password'), 'password123');

      const form = document.querySelector('.signin-form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      });
    });

    it('should navigate to /mystory after successful login', async () => {
      renderSignIn();
      const user = userEvent.setup();

      await user.type(screen.getByPlaceholderText('Email'), 'test@example.com');
      await user.type(screen.getByPlaceholderText('Password'), 'password123');

      const form = document.querySelector('.signin-form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/mystory');
      });
    });

    it('should disable submit button when loading', () => {
      useLogin.mockReturnValue({
        login: mockLogin,
        error: null,
        isLoading: true,
      });

      renderSignIn();
      const submitButton = screen.getByRole('button', { name: 'SIGN IN' });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Error Handling', () => {
    it('should display error message when error exists', () => {
      useLogin.mockReturnValue({
        login: mockLogin,
        error: 'Invalid credentials',
        isLoading: false,
      });

      renderSignIn();
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    it('should not display error div when no error', () => {
      renderSignIn();
      const errorDiv = document.querySelector('.error-message');
      expect(errorDiv).not.toBeInTheDocument();
    });

    it('should log error on form submission if error exists', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      useLogin.mockReturnValue({
        login: mockLogin,
        error: 'Network error',
        isLoading: false,
      });

      renderSignIn();
      const user = userEvent.setup();

      await user.type(screen.getByPlaceholderText('Email'), 'test@example.com');
      await user.type(screen.getByPlaceholderText('Password'), 'password123');

      const form = document.querySelector('.signin-form');
      fireEvent.submit(form);

      expect(consoleSpy).toHaveBeenCalledWith('Network error');
      consoleSpy.mockRestore();
    });
  });

  describe('Google Login', () => {
    it('should call googleLogin when Google button is clicked', async () => {
      renderSignIn();
      const user = userEvent.setup();
      const googleButton = screen.getByRole('button', { name: /Continue with Google/i });

      await user.click(googleButton);
      expect(mockGoogleLogin).toHaveBeenCalled();
    });

    it('should handle successful Google login', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          email: 'user@gmail.com',
          given_name: 'John',
          family_name: 'Doe',
          id: '123456',
        }),
      });

      renderSignIn();

      const tokenResponse = { access_token: 'fake-token' };
      await mockGoogleLogin.onSuccess(tokenResponse);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: {
            Authorization: 'Bearer fake-token',
            Accept: 'application/json',
          },
        }
      );

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith(
          'user@gmail.com',
          'DOE123456user@gmail.com'
        );
        expect(mockNavigate).toHaveBeenCalledWith('/mystory');
      });
    });

    it('should handle Google login error', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      renderSignIn();

      const error = { message: 'Login failed' };
      mockGoogleLogin.onError(error);

      expect(consoleSpy).toHaveBeenCalledWith('Login Failed:', error);
      consoleSpy.mockRestore();
    });

    it('should handle failed user info fetch', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      renderSignIn();

      await mockGoogleLogin.onSuccess({ access_token: 'fake-token' });

      expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch user info');
      consoleSpy.mockRestore();
    });
  });

  describe('UI Elements', () => {
    it('should render divider with OR text', () => {
      renderSignIn();
      const divider = document.querySelector('.divider');
      expect(divider).toBeInTheDocument();
      expect(screen.getByText('OR')).toBeInTheDocument();
    });

    it('should render "Don\'t have an account?" text', () => {
      renderSignIn();
      expect(screen.getByText(/Don't have an account\?/i)).toBeInTheDocument();
    });

    it('should apply correct CSS classes', () => {
      renderSignIn();
      
      expect(document.querySelector('.signin-header')).toBeInTheDocument();
      expect(document.querySelector('.signin-right')).toBeInTheDocument();
      expect(document.querySelector('.signin-box')).toBeInTheDocument();
      expect(document.querySelector('.signin-form')).toBeInTheDocument();
      expect(document.querySelector('.password-wrapper')).toBeInTheDocument();
      expect(document.querySelector('.signin-bottom-image')).toBeInTheDocument();
    });
  });

  describe('Input Types', () => {
    it('should have correct input types', () => {
      renderSignIn();
      
      expect(screen.getByPlaceholderText('Email')).toHaveAttribute('type', 'email');
      expect(screen.getByPlaceholderText('Password')).toHaveAttribute('type', 'password');
    });
  });

  describe('Console Logging', () => {
    it('should log token response on successful Google login', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          email: 'user@gmail.com',
          given_name: 'John',
          family_name: 'Doe',
          id: '123456',
        }),
      });

      renderSignIn();

      const tokenResponse = { access_token: 'fake-token' };
      await mockGoogleLogin.onSuccess(tokenResponse);

      expect(consoleSpy).toHaveBeenCalledWith('Token Response:', tokenResponse);
      consoleSpy.mockRestore();
    });
  });
});
