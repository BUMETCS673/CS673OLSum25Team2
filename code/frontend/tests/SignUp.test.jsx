import React from 'react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import SignUp from '../src/pages/Auth/SighUp/SignUp';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useSignUp } from '../src/hooks/Auth/useSignUp';

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

vi.mock('../src/hooks/Auth/useSignUp', () => ({
  useSignUp: vi.fn(),
}));

vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, className }) => (
    <span data-testid="font-awesome-icon" className={className}>
      {icon.iconName || 'icon'}
    </span>
  ),
}));

describe('SignUp Component', () => {
  let mockNavigate;
  let mockSignup;
  let mockGoogleLogin;

  beforeEach(() => {
    mockNavigate = vi.fn();
    mockSignup = vi.fn();
    mockGoogleLogin = vi.fn();

    useNavigate.mockReturnValue(mockNavigate);
    useSignUp.mockReturnValue({
      signup: mockSignup,
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

  const renderSignUp = () => {
    return render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );
  };

  describe('Component Structure', () => {
    it('should render the main section with correct class', () => {
      renderSignUp();
      const section = document.querySelector('section.SignUp');
      expect(section).toBeInTheDocument();
    });

    it('should render the header with app name', () => {
      renderSignUp();
      const header = screen.getByRole('heading', { 
        level: 1, 
        name: 'MY MAGICAL BEDTIME' 
      });
      expect(header).toBeInTheDocument();
    });

    it('should render sign up form heading', () => {
      renderSignUp();
      const heading = screen.getByRole('heading', { 
        level: 2, 
        name: 'Sign Up' 
      });
      expect(heading).toBeInTheDocument();
    });

    it('should render the illustration image', () => {
      renderSignUp();
      const image = screen.getByAltText('Illustration');
      expect(image).toBeInTheDocument();
      expect(image).toHaveClass('signup-image');
    });
  });

  describe('Form Elements', () => {
    it('should render all input fields', () => {
      renderSignUp();
      
      expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    });

    it('should render submit button', () => {
      renderSignUp();
      const submitButton = screen.getByRole('button', { name: 'SIGN UP' });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('should render Google sign-in button', () => {
      renderSignUp();
      const googleButton = screen.getByRole('button', { name: /Continue with Google/i });
      expect(googleButton).toBeInTheDocument();
    });

    it('should render sign in link', () => {
      renderSignUp();
      const signInLink = screen.getByRole('link', { name: 'Sign in' });
      expect(signInLink).toBeInTheDocument();
      expect(signInLink).toHaveAttribute('href', '/login');
    });
  });

  describe('Password Visibility Toggle', () => {
    it('should initially show password as hidden', () => {
      renderSignUp();
      const passwordInput = screen.getByPlaceholderText('Password');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });


    it('should toggle password visibility when eye icon is clicked', async () => {
      renderSignUp();
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
    it('should call signup with form data on submit', async () => {
      renderSignUp();
      const user = userEvent.setup();

      await user.type(screen.getByPlaceholderText('First Name'), 'John');
      await user.type(screen.getByPlaceholderText('Last Name'), 'Doe');
      await user.type(screen.getByPlaceholderText('Email'), 'john@example.com');
      await user.type(screen.getByPlaceholderText('Password'), 'password123');

      const form = document.querySelector('.signup-form');
      fireEvent.submit(form);

      expect(mockSignup).toHaveBeenCalledWith(
        'john@example.com',
        'password123',
        'John',
        'Doe'
      );
    });

    it('should navigate to /mystory after successful signup', async () => {
      renderSignUp();
      const user = userEvent.setup();

      await user.type(screen.getByPlaceholderText('First Name'), 'John');
      await user.type(screen.getByPlaceholderText('Last Name'), 'Doe');
      await user.type(screen.getByPlaceholderText('Email'), 'john@example.com');
      await user.type(screen.getByPlaceholderText('Password'), 'password123');

      const form = document.querySelector('.signup-form');
      fireEvent.submit(form);

      expect(mockNavigate).toHaveBeenCalledWith('/mystory');
    });

    it('should disable submit button when loading', () => {
      useSignUp.mockReturnValue({
        signup: mockSignup,
        error: null,
        isLoading: true,
      });

      renderSignUp();
      const submitButton = screen.getByRole('button', { name: 'SIGN UP' });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Error Handling', () => {
    it('should display error message when error exists', () => {
      useSignUp.mockReturnValue({
        signup: mockSignup,
        error: 'Email already exists',
        isLoading: false,
      });

      renderSignUp();
      expect(screen.getByText('Email already exists')).toBeInTheDocument();
    });

    it('should not display error div when no error', () => {
      renderSignUp();
      const errorDiv = document.querySelector('.error-message');
      expect(errorDiv).not.toBeInTheDocument();
    });
  });

  describe('Google Login', () => {
    it('should call googleLogin when Google button is clicked', async () => {
      renderSignUp();
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

      renderSignUp();

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
        expect(mockSignup).toHaveBeenCalledWith(
          'user@gmail.com',
          'DOE123456user@gmail.com',
          'John',
          'Doe'
        );
        expect(mockNavigate).toHaveBeenCalledWith('/mystory');
      });
    });

    it('should handle Google login error', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      renderSignUp();

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
      renderSignUp();

      await mockGoogleLogin.onSuccess({ access_token: 'fake-token' });

      expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch user info');
      consoleSpy.mockRestore();
    });
  });

  describe('UI Elements', () => {
    it('should render divider with OR text', () => {
      renderSignUp();
      const divider = document.querySelector('.divider');
      expect(divider).toBeInTheDocument();
      expect(screen.getByText('OR')).toBeInTheDocument();
    });

    it('should render "Already have an account?" text', () => {
      renderSignUp();
      expect(screen.getByText(/Already have an account\?/i)).toBeInTheDocument();
    });

    it('should apply correct CSS classes', () => {
      renderSignUp();
      
      expect(document.querySelector('.signup-header')).toBeInTheDocument();
      expect(document.querySelector('.signup-right')).toBeInTheDocument();
      expect(document.querySelector('.signup-box')).toBeInTheDocument();
      expect(document.querySelector('.signup-form')).toBeInTheDocument();
      expect(document.querySelector('.password-wrapper')).toBeInTheDocument();
      expect(document.querySelector('.signup-bottom-image')).toBeInTheDocument();
    });
  });

  describe('Input Types', () => {
    it('should have correct input types', () => {
      renderSignUp();
      
      expect(screen.getByPlaceholderText('First Name')).toHaveAttribute('type', 'text');
      expect(screen.getByPlaceholderText('Last Name')).toHaveAttribute('type', 'text');
      expect(screen.getByPlaceholderText('Email')).toHaveAttribute('type', 'email');
      expect(screen.getByPlaceholderText('Password')).toHaveAttribute('type', 'password');
    });
  });
});
