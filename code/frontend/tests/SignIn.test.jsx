import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import SignIn from '../src/pages/Auth/SignIn/SignIn';
import { useLogin } from '../src/hooks/Auth/useLogin';
import { useGoogleLogin } from '@react-oauth/google';

// Mock the useLogin hook
vi.mock('../src/hooks/Auth/useLogin');

// Mock the Google OAuth hook
vi.mock('@react-oauth/google', () => ({
  useGoogleLogin: vi.fn(),
}));

// Mock FontAwesome components
vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, className }) => (
    <span data-testid="font-awesome-icon" className={className}>
      {icon.iconName || 'icon'}
    </span>
  ),
}));

// Mock CSS import
vi.mock('./SignIn.css', () => ({}));

// Mock image import
vi.mock('../src/assets/signin_image.png', () => ({
  default: 'mocked-signin-image.png'
}));

// Helper function to render component with router
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('SignIn Component', () => {
  const mockLogin = vi.fn();
  const mockGoogleLogin = vi.fn();
  const mockUseLogin = vi.mocked(useLogin);
  const mockUseGoogleLogin = vi.mocked(useGoogleLogin);

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    
    // Default mock implementation for useLogin
    mockUseLogin.mockReturnValue({
      login: mockLogin,
      error: null,
      isLoading: false,
    });

    // Default mock implementation for useGoogleLogin
    mockUseGoogleLogin.mockReturnValue(mockGoogleLogin);
  });

  describe('Rendering', () => {
    it('renders all form elements correctly', () => {
      renderWithRouter(<SignIn />);

      expect(screen.getByText('MY MAGICAL BEDTIME')).toBeInTheDocument();
      expect(screen.getByText('Welcome!')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'SIGN IN' })).toBeInTheDocument();
      expect(screen.getByText('Continue with Google')).toBeInTheDocument();
    });

    it('renders sign up link correctly', () => {
      renderWithRouter(<SignIn />);
      
      const signUpLink = screen.getByRole('link', { name: 'Sign up' });
      expect(signUpLink).toBeInTheDocument();
      expect(signUpLink).toHaveAttribute('href', '/signup');
    });

    it('renders illustration image', () => {
      renderWithRouter(<SignIn />);
      
      const image = screen.getByAltText('Illustration');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src');
      const srcValue = image.getAttribute('src');
      expect(srcValue).toBeTruthy();
    });

    it('renders divider with OR text', () => {
      renderWithRouter(<SignIn />);
      
      expect(screen.getByText('OR')).toBeInTheDocument();
    });

    it('renders account creation prompt text', () => {
      renderWithRouter(<SignIn />);
      
      expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    });
  });

  describe('Password Visibility Toggle', () => {
    it('password field is initially hidden', () => {
      renderWithRouter(<SignIn />);
      
      const passwordInput = screen.getByPlaceholderText('Password');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('toggles password visibility when eye icon is clicked', () => {
      renderWithRouter(<SignIn />);
      
      const passwordInput = screen.getByPlaceholderText('Password');
      // Find the password toggle icon specifically by its parent container
      const passwordWrapper = document.querySelector('.password-wrapper');
      const toggleIcon = passwordWrapper.querySelector('[data-testid="font-awesome-icon"]');
      
      // Initially hidden
      expect(passwordInput).toHaveAttribute('type', 'password');
      
      // Click to show
      fireEvent.click(toggleIcon);
      expect(passwordInput).toHaveAttribute('type', 'text');
      
      // Click to hide again
      fireEvent.click(toggleIcon);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Form Submission', () => {
    it('calls login function with correct parameters on form submission', async () => {
      renderWithRouter(<SignIn />);
      
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const submitButton = screen.getByRole('button', { name: 'SIGN IN' });

      // Fill in form
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      // Submit form
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      });
    });

    it('prevents default form submission behavior', () => {
      renderWithRouter(<SignIn />);
      
      const form = document.querySelector('.signin-form');
      
      // Fire submit event on the form
      fireEvent.submit(form);
      
      // The component should call login function, which indicates preventDefault was handled
      expect(mockLogin).toHaveBeenCalled();
    });

    it('handles form submission with empty fields', async () => {
      renderWithRouter(<SignIn />);
      
      const submitButton = screen.getByRole('button', { name: 'SIGN IN' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('', '');
      });
    });

    it('handles async form submission', async () => {
      mockLogin.mockResolvedValue({ success: true });
      
      renderWithRouter(<SignIn />);
      
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const submitButton = screen.getByRole('button', { name: 'SIGN IN' });

      fireEvent.change(emailInput, { target: { value: 'async@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'asyncpass' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('async@test.com', 'asyncpass');
      });
    });
  });

  describe('Loading State', () => {
    it('disables submit button when loading', () => {
      mockUseLogin.mockReturnValue({
        login: mockLogin,
        error: null,
        isLoading: true,
      });

      renderWithRouter(<SignIn />);
      
      const submitButton = screen.getByRole('button', { name: 'SIGN IN' });
      expect(submitButton).toBeDisabled();
    });

    it('enables submit button when not loading', () => {
      mockUseLogin.mockReturnValue({
        login: mockLogin,
        error: null,
        isLoading: false,
      });

      renderWithRouter(<SignIn />);
      
      const submitButton = screen.getByRole('button', { name: 'SIGN IN' });
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Error Handling', () => {
    it('displays error message when error exists', () => {
      const errorMessage = 'Invalid credentials';
      mockUseLogin.mockReturnValue({
        login: mockLogin,
        error: errorMessage,
        isLoading: false,
      });

      renderWithRouter(<SignIn />);
      
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toHaveClass('error-message');
    });

    it('does not display error message when no error', () => {
      mockUseLogin.mockReturnValue({
        login: mockLogin,
        error: null,
        isLoading: false,
      });

      renderWithRouter(<SignIn />);
      
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });

    it('displays authentication error messages', () => {
      const errorMessage = 'User not found';
      mockUseLogin.mockReturnValue({
        login: mockLogin,
        error: errorMessage,
        isLoading: false,
      });

      renderWithRouter(<SignIn />);
      
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('form inputs accept user input correctly', () => {
      renderWithRouter(<SignIn />);
      
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');

      fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'userpassword' } });

      expect(emailInput.value).toBe('user@example.com');
      expect(passwordInput.value).toBe('userpassword');
    });

    it('email input has correct type attribute', () => {
      renderWithRouter(<SignIn />);
      
      const emailInput = screen.getByPlaceholderText('Email');
      expect(emailInput).toHaveAttribute('type', 'email');
    });
  });

  describe('Google OAuth Integration', () => {
    it('calls useGoogleLogin hook on component mount', () => {
      renderWithRouter(<SignIn />);
      
      expect(mockUseGoogleLogin).toHaveBeenCalled();
    });

    it('configures Google login with success callback', () => {
      renderWithRouter(<SignIn />);
      
      expect(mockUseGoogleLogin).toHaveBeenCalledWith({
        onSuccess: expect.any(Function)
      });
    });

    it('calls Google login function when Google button is clicked', () => {
      renderWithRouter(<SignIn />);
      
      const googleButton = screen.getByText('Continue with Google');
      fireEvent.click(googleButton);
      
      expect(mockGoogleLogin).toHaveBeenCalled();
    });

    it('handles Google login success callback', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const mockTokenResponse = { access_token: 'test-token' };
    
      renderWithRouter(<SignIn />);
    
      // Check if the mock was called before accessing it
      expect(mockUseGoogleLogin).toHaveBeenCalled();
      expect(mockUseGoogleLogin.mock.calls).toHaveLength(1);
      expect(mockUseGoogleLogin.mock.calls[0]).toBeDefined();
      expect(mockUseGoogleLogin.mock.calls[0][0]).toBeDefined();
    
      // Get the onSuccess callback that was passed to useGoogleLogin
      const onSuccessCallback = mockUseGoogleLogin.mock.calls[0][0].onSuccess;
      expect(onSuccessCallback).toBeDefined();
    
      // Call the success callback directly
      onSuccessCallback(mockTokenResponse);
    
      expect(consoleSpy).toHaveBeenCalledWith(mockTokenResponse);
    
      consoleSpy.mockRestore();
    });
  });

  describe('Integration with useLogin Hook', () => {
    it('calls useLogin hook on component mount', () => {
      renderWithRouter(<SignIn />);
      
      expect(mockUseLogin).toHaveBeenCalled();
    });

    it('handles hook state changes correctly', () => {
      const { rerender } = renderWithRouter(<SignIn />);
      
      // Initial state
      expect(screen.getByRole('button', { name: 'SIGN IN' })).not.toBeDisabled();
      
      // Update to loading state
      mockUseLogin.mockReturnValue({
        login: mockLogin,
        error: null,
        isLoading: true,
      });
      
      rerender(<BrowserRouter><SignIn /></BrowserRouter>);
      expect(screen.getByRole('button', { name: 'SIGN IN' })).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('form has proper structure for screen readers', () => {
      renderWithRouter(<SignIn />);
      
      // Find form by its class or by querying for the form element directly
      const form = document.querySelector('.signin-form');
      expect(form).toBeInTheDocument();
      expect(form.tagName).toBe('FORM');
      
      const submitButton = screen.getByRole('button', { name: 'SIGN IN' });
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('password toggle button is accessible', () => {
      renderWithRouter(<SignIn />);
      
      // Find the password toggle icon specifically by its parent container
      const passwordWrapper = document.querySelector('.password-wrapper');
      const toggleIcon = passwordWrapper.querySelector('[data-testid="font-awesome-icon"]');
      
      expect(toggleIcon).toBeInTheDocument();
      
      // Should be clickable
      fireEvent.click(toggleIcon);
      expect(screen.getByPlaceholderText('Password')).toHaveAttribute('type', 'text');
    });

    it('Google button is accessible', () => {
      renderWithRouter(<SignIn />);
      
      const googleButton = screen.getByText('Continue with Google');
      expect(googleButton.tagName).toBe('BUTTON');
    });
  });

  describe('Console Logging', () => {
    it('logs form data to console on submission', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      renderWithRouter(<SignIn />);
      
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const submitButton = screen.getByRole('button', { name: 'SIGN IN' });

      fireEvent.change(emailInput, { target: { value: 'log@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'logpass' } });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('log@test.com', 'logpass');
      });
      
      consoleSpy.mockRestore();
    });

    it('logs error to console when error exists', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const errorMessage = 'Test signin error';
      
      mockUseLogin.mockReturnValue({
        login: mockLogin,
        error: errorMessage,
        isLoading: false,
      });

      renderWithRouter(<SignIn />);
      
      const submitButton = screen.getByRole('button', { name: 'SIGN IN' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(errorMessage);
      });
      
      consoleSpy.mockRestore();
    });
  });

  describe('Component State Management', () => {
    it('manages password visibility state correctly', () => {
      renderWithRouter(<SignIn />);
      
      const passwordInput = screen.getByPlaceholderText('Password');
      const passwordWrapper = document.querySelector('.password-wrapper');
      const toggleIcon = passwordWrapper.querySelector('[data-testid="font-awesome-icon"]');
      
      // Test multiple toggles
      expect(passwordInput).toHaveAttribute('type', 'password');
      
      fireEvent.click(toggleIcon);
      expect(passwordInput).toHaveAttribute('type', 'text');
      
      fireEvent.click(toggleIcon);
      expect(passwordInput).toHaveAttribute('type', 'password');
      
      fireEvent.click(toggleIcon);
      expect(passwordInput).toHaveAttribute('type', 'text');
    });
  });

  describe('Form Structure', () => {
    it('has correct form structure with proper input order', () => {
      renderWithRouter(<SignIn />);
      
      const form = document.querySelector('.signin-form');
      const inputs = form.querySelectorAll('input');
      
      expect(inputs).toHaveLength(2);
      expect(inputs[0]).toHaveAttribute('type', 'email');
      expect(inputs[1]).toHaveAttribute('type', 'password');
    });

    it('form submission accesses inputs by correct index', async () => {
      renderWithRouter(<SignIn />);
      
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      
      fireEvent.change(emailInput, { target: { value: 'index@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'indexpass' } });
      
      const submitButton = screen.getByRole('button', { name: 'SIGN IN' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('index@test.com', 'indexpass');
      });
    });
  });
});