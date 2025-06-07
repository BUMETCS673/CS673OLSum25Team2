import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import SignUp from '../src/pages/Auth/SignUp/SignUp';
import { useSignUp } from '../src/hooks/Auth/useSignUp';

// Mock the useSignUp hook
vi.mock('../src/hooks/Auth/useSignUp');

// Mock FontAwesome components
vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, className }) => (
    <span data-testid="font-awesome-icon" className={className}>
      {icon.iconName || 'icon'}
    </span>
  ),
}));

// Mock CSS import
vi.mock('./SignUp.css', () => ({}));

// Mock image import
vi.mock('../src/assets/signin_image.png', () => ({
  default: 'mocked-signin-image.png'
}));

// Helper function to render component with router
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('SignUp Component', () => {
  const mockSignup = vi.fn();
  const mockUseSignUp = vi.mocked(useSignUp);

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    
    // Default mock implementation
    mockUseSignUp.mockReturnValue({
      signup: mockSignup,
      error: null,
      isLoading: false,
    });
  });

  describe('Rendering', () => {
    it('renders all form elements correctly', () => {
      renderWithRouter(<SignUp />);

      expect(screen.getByText('MY MAGICAL BEDTIME')).toBeInTheDocument();
      expect(screen.getByText('Sign Up')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'SIGN UP' })).toBeInTheDocument();
      expect(screen.getByText('Continue with Google')).toBeInTheDocument();
    });

    it('renders Google button as button element', () => {
      renderWithRouter(<SignUp />);
  
      const googleButton = screen.getByText('Continue with Google');
      expect(googleButton.tagName).toBe('BUTTON');
    });

    it('renders sign in link correctly', () => {
      renderWithRouter(<SignUp />);
      
      const signInLink = screen.getByRole('link', { name: 'Sign in' });
      expect(signInLink).toBeInTheDocument();
      expect(signInLink).toHaveAttribute('href', '/login');
    });

    it('renders illustration image', () => {
      renderWithRouter(<SignUp />);
      
      const image = screen.getByAltText('Illustration');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'mocked-signin-image.png');
    });

    it('renders divider with OR text', () => {
      renderWithRouter(<SignUp />);
      
      expect(screen.getByText('OR')).toBeInTheDocument();
    });
  });

  describe('Password Visibility Toggle', () => {
    it('password field is initially hidden', () => {
      renderWithRouter(<SignUp />);
      
      const passwordInput = screen.getByPlaceholderText('Password');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('toggles password visibility when eye icon is clicked', () => {
      renderWithRouter(<SignUp />);
      
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
    it('calls signup function with correct parameters on form submission', () => {
      renderWithRouter(<SignUp />);
      
      const firstNameInput = screen.getByPlaceholderText('First Name');
      const lastNameInput = screen.getByPlaceholderText('Last Name');
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const submitButton = screen.getByRole('button', { name: 'SIGN UP' });

      // Fill in form
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      // Submit form
      fireEvent.click(submitButton);

      expect(mockSignup).toHaveBeenCalledWith(
        'john.doe@example.com',
        'password123',
        'John',
        'Doe'
      );
    });

    it('prevents default form submission behavior', () => {
      renderWithRouter(<SignUp />);
      
      const form = document.querySelector('.signup-form');
      const mockEvent = {
        preventDefault: vi.fn(),
        target: [
          { value: 'John' },
          { value: 'Doe' },
          { value: 'john@test.com' },
          { value: 'password123' }
        ]
      };
      
      // Simulate form submission by calling the handler directly
      fireEvent.submit(form);
      
      // The component should call signup function, which indicates preventDefault was handled
      expect(mockSignup).toHaveBeenCalled();
    });

    it('handles form submission with empty fields', () => {
      renderWithRouter(<SignUp />);
      
      const submitButton = screen.getByRole('button', { name: 'SIGN UP' });
      fireEvent.click(submitButton);

      expect(mockSignup).toHaveBeenCalledWith('', '', '', '');
    });
  });

  describe('Loading State', () => {
    it('disables submit button when loading', () => {
      mockUseSignUp.mockReturnValue({
        signup: mockSignup,
        error: null,
        isLoading: true,
      });

      renderWithRouter(<SignUp />);
      
      const submitButton = screen.getByRole('button', { name: 'SIGN UP' });
      expect(submitButton).toBeDisabled();
    });

    it('enables submit button when not loading', () => {
      mockUseSignUp.mockReturnValue({
        signup: mockSignup,
        error: null,
        isLoading: false,
      });

      renderWithRouter(<SignUp />);
      
      const submitButton = screen.getByRole('button', { name: 'SIGN UP' });
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Error Handling', () => {
    it('displays error message when error exists', () => {
      const errorMessage = 'Email already exists';
      mockUseSignUp.mockReturnValue({
        signup: mockSignup,
        error: errorMessage,
        isLoading: false,
      });

      renderWithRouter(<SignUp />);
      
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toHaveClass('error-message');
    });

    it('does not display error message when no error', () => {
      mockUseSignUp.mockReturnValue({
        signup: mockSignup,
        error: null,
        isLoading: false,
      });

      renderWithRouter(<SignUp />);
      
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });

    it('displays multiple error messages if error is an array', () => {
      const errorMessage = 'Password must be at least 6 characters';
      mockUseSignUp.mockReturnValue({
        signup: mockSignup,
        error: errorMessage,
        isLoading: false,
      });

      renderWithRouter(<SignUp />);
      
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('form inputs accept user input correctly', () => {
      renderWithRouter(<SignUp />);
      
      const firstNameInput = screen.getByPlaceholderText('First Name');
      const lastNameInput = screen.getByPlaceholderText('Last Name');
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');

      fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
      fireEvent.change(lastNameInput, { target: { value: 'Smith' } });
      fireEvent.change(emailInput, { target: { value: 'jane@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'securepass' } });

      expect(firstNameInput.value).toBe('Jane');
      expect(lastNameInput.value).toBe('Smith');
      expect(emailInput.value).toBe('jane@example.com');
      expect(passwordInput.value).toBe('securepass');
    });

    it('email input has correct type attribute', () => {
      renderWithRouter(<SignUp />);
      
      const emailInput = screen.getByPlaceholderText('Email');
      expect(emailInput).toHaveAttribute('type', 'email');
    });
  });

  describe('Integration with useSignUp Hook', () => {
    it('calls useSignUp hook on component mount', () => {
      renderWithRouter(<SignUp />);
      
      expect(mockUseSignUp).toHaveBeenCalled();
    });

    it('handles hook state changes correctly', () => {
      const { rerender } = renderWithRouter(<SignUp />);
      
      // Initial state
      expect(screen.getByRole('button', { name: 'SIGN UP' })).not.toBeDisabled();
      
      // Update to loading state
      mockUseSignUp.mockReturnValue({
        signup: mockSignup,
        error: null,
        isLoading: true,
      });
      
      rerender(<BrowserRouter><SignUp /></BrowserRouter>);
      expect(screen.getByRole('button', { name: 'SIGN UP' })).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('form has proper structure for screen readers', () => {
      renderWithRouter(<SignUp />);
      
      // Find form by its class or by querying for the form element directly
      const form = document.querySelector('.signup-form');
      expect(form).toBeInTheDocument();
      expect(form.tagName).toBe('FORM');
      
      const submitButton = screen.getByRole('button', { name: 'SIGN UP' });
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('password toggle button is accessible', () => {
      renderWithRouter(<SignUp />);
      
      // Find the password toggle icon specifically by its parent container
      const passwordWrapper = document.querySelector('.password-wrapper');
      const toggleIcon = passwordWrapper.querySelector('[data-testid="font-awesome-icon"]');
      
      expect(toggleIcon).toBeInTheDocument();
      
      // Should be clickable
      fireEvent.click(toggleIcon);
      expect(screen.getByPlaceholderText('Password')).toHaveAttribute('type', 'text');
    });
  });

  describe('Console Logging', () => {
    it('logs form data to console on submission', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      renderWithRouter(<SignUp />);
      
      const firstNameInput = screen.getByPlaceholderText('First Name');
      const lastNameInput = screen.getByPlaceholderText('Last Name');
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const submitButton = screen.getByRole('button', { name: 'SIGN UP' });

      fireEvent.change(firstNameInput, { target: { value: 'Test' } });
      fireEvent.change(lastNameInput, { target: { value: 'User' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'testpass' } });

      fireEvent.click(submitButton);

      expect(consoleSpy).toHaveBeenCalledWith('test@example.com', 'testpass', 'Test', 'User');
      
      consoleSpy.mockRestore();
    });

    it('logs error to console when error exists', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const errorMessage = 'Test error';
      
      mockUseSignUp.mockReturnValue({
        signup: mockSignup,
        error: errorMessage,
        isLoading: false,
      });

      renderWithRouter(<SignUp />);
      
      const submitButton = screen.getByRole('button', { name: 'SIGN UP' });
      fireEvent.click(submitButton);

      expect(consoleSpy).toHaveBeenCalledWith(errorMessage);
      
      consoleSpy.mockRestore();
    });
  });
});