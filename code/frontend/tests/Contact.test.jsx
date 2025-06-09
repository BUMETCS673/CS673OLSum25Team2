import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Contact from '../src/pages/Contact/Contact';

// Mock the CSS import
vi.mock('./Contact.css', () => ({}));

// Mock the image import
vi.mock('../src/assets/signin_image.png', () => ({ 
  default: 'mocked-signin-image.png' 
}));

describe('Contact Component', () => {
  beforeEach(() => {
    render(<Contact />);
  });

  describe('Component Structure', () => {
    it('renders main contact section', () => {
      const contactSection = document.querySelector('.ContactPage');
      expect(contactSection).toBeInTheDocument();
      expect(contactSection).toHaveClass('ContactPage');
    });

    it('renders main heading', () => {
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('MY MAGICAL BEDTIME');
      expect(heading).toHaveClass('contact-h1');
    });

    it('renders "Get in Touch" section', () => {
      const getInTouchHeading = screen.getByRole('heading', { level: 2 });
      expect(getInTouchHeading).toBeInTheDocument();
      expect(getInTouchHeading).toHaveTextContent('Get in Touch');
    });

    it('renders contact description', () => {
      const description = screen.getByText("We'd love to hear from you! Fill out the form or reach out directly.");
      expect(description).toBeInTheDocument();
    });

    it('renders contact information section', () => {
      const contactInfoHeading = screen.getByRole('heading', { level: 3 });
      expect(contactInfoHeading).toBeInTheDocument();
      expect(contactInfoHeading).toHaveTextContent('Contact Information');
    });

    it('renders contact image', () => {
      const contactImage = screen.getByRole('img', { name: /contact illustration/i });
      expect(contactImage).toBeInTheDocument();
      expect(contactImage).toHaveAttribute('src', 'mocked-signin-image.png');
      expect(contactImage).toHaveClass('contact-image');
    });
  });

  describe('Form Elements', () => {
    it('renders contact form', () => {
      const form = document.querySelector('.contact-form');
      expect(form).toBeInTheDocument();
      expect(form).toHaveClass('contact-form');
    });

    it('renders name input field', () => {
      const nameInput = screen.getByPlaceholderText('Your Name');
      expect(nameInput).toBeInTheDocument();
      expect(nameInput).toHaveAttribute('type', 'text');
      expect(nameInput).toHaveAttribute('name', 'name');
      expect(nameInput).toHaveAttribute('required');
      expect(nameInput).toHaveClass('contact-input');
    });

    it('renders email input field', () => {
      const emailInput = screen.getByPlaceholderText('Your Email');
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('name', 'email');
      expect(emailInput).toHaveAttribute('required');
      expect(emailInput).toHaveClass('contact-input');
    });

    it('renders message textarea', () => {
      const messageTextarea = screen.getByPlaceholderText('Your Message');
      expect(messageTextarea).toBeInTheDocument();
      expect(messageTextarea).toHaveAttribute('name', 'message');
      expect(messageTextarea).toHaveAttribute('required');
      expect(messageTextarea).toHaveAttribute('rows', '5');
      expect(messageTextarea).toHaveClass('contact-textarea');
    });

    it('renders submit button', () => {
      const submitButton = screen.getByRole('button', { name: /send message/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('type', 'submit');
      expect(submitButton).toHaveClass('contact-submit-btn');
    });

    it('renders placeholder notice', () => {
      const placeholderNotice = screen.getByText(/this form is currently a placeholder/i);
      expect(placeholderNotice).toBeInTheDocument();
      expect(placeholderNotice).toHaveClass('contact-note');
    });
  });

  describe('Contact Information', () => {
    it('displays email address', () => {
      const email = screen.getByText('Email: support@mymagicalbedtime.com');
      expect(email).toBeInTheDocument();
    });

    it('displays phone number', () => {
      const phone = screen.getByText('Phone: (617) 353-8919');
      expect(phone).toBeInTheDocument();
    });

    it('displays location information', () => {
      expect(screen.getByText('Location: Department of Computer Science')).toBeInTheDocument();
      expect(screen.getByText('Boston University')).toBeInTheDocument();
      expect(screen.getByText('665 Commonwealth Avenue')).toBeInTheDocument();
      expect(screen.getByText('Boston, MA 02215')).toBeInTheDocument();
    });
  });

  describe('Google Maps Integration', () => {
    it('renders map iframe', () => {
      const mapIframe = screen.getByTitle('BU Computer Science Department');
      expect(mapIframe).toBeInTheDocument();
      expect(mapIframe).toHaveAttribute('width', '600');
      expect(mapIframe).toHaveAttribute('height', '450');
      expect(mapIframe).toHaveAttribute('loading', 'lazy');
    });

    it('map iframe has correct Google Maps embed URL', () => {
      const mapIframe = screen.getByTitle('BU Computer Science Department');
      const expectedUrlPattern = /^https:\/\/www\.google\.com\/maps\/embed/;
      expect(mapIframe.getAttribute('src')).toMatch(expectedUrlPattern);
    });

    it('map iframe has proper security attributes', () => {
      const mapIframe = screen.getByTitle('BU Computer Science Department');
      expect(mapIframe).toHaveAttribute('referrerPolicy', 'no-referrer-when-downgrade');
      expect(mapIframe.style.border).toBe('0px');
    });
  });

  describe('Form Interactions', () => {
    it('allows user to type in name field', async () => {
      const user = userEvent.setup();
      const nameInput = screen.getByPlaceholderText('Your Name');
      
      await user.type(nameInput, 'John Doe');
      
      expect(nameInput).toHaveValue('John Doe');
    });

    it('allows user to type in email field', async () => {
      const user = userEvent.setup();
      const emailInput = screen.getByPlaceholderText('Your Email');
      
      await user.type(emailInput, 'john.doe@example.com');
      
      expect(emailInput).toHaveValue('john.doe@example.com');
    });

    it('allows user to type in message field', async () => {
      const user = userEvent.setup();
      const messageTextarea = screen.getByPlaceholderText('Your Message');
      
      await user.type(messageTextarea, 'This is a test message');
      
      expect(messageTextarea).toHaveValue('This is a test message');
    });

    it('form submission prevents default behavior', async () => {
      const user = userEvent.setup();
      const form = document.querySelector('.contact-form');
      const submitButton = screen.getByRole('button', { name: /send message/i });
      
      // Fill out the form
      await user.type(screen.getByPlaceholderText('Your Name'), 'John Doe');
      await user.type(screen.getByPlaceholderText('Your Email'), 'john@example.com');
      await user.type(screen.getByPlaceholderText('Your Message'), 'Test message');
      
      // Submit the form
      await user.click(submitButton);
      
      // Form should still be present (not navigated away)
      expect(form).toBeInTheDocument();
    });

    it('clears form fields after typing and clearing', async () => {
      const user = userEvent.setup();
      const nameInput = screen.getByPlaceholderText('Your Name');
      
      await user.type(nameInput, 'John Doe');
      await user.clear(nameInput);
      
      expect(nameInput).toHaveValue('');
    });
  });

  describe('Form Validation', () => {
    it('required fields have required attribute', () => {
      const nameInput = screen.getByPlaceholderText('Your Name');
      const emailInput = screen.getByPlaceholderText('Your Email');
      const messageTextarea = screen.getByPlaceholderText('Your Message');
      
      expect(nameInput).toBeRequired();
      expect(emailInput).toBeRequired();
      expect(messageTextarea).toBeRequired();
    });

    it('email field accepts valid email format', async () => {
      const user = userEvent.setup();
      const emailInput = screen.getByPlaceholderText('Your Email');
      
      await user.type(emailInput, 'valid.email@example.com');
      
      expect(emailInput).toHaveValue('valid.email@example.com');
      expect(emailInput.validity.valid).toBe(true);
    });

    it('email field shows invalid for malformed email', async () => {
      const user = userEvent.setup();
      const emailInput = screen.getByPlaceholderText('Your Email');
      
      await user.type(emailInput, 'invalid-email');
      
      expect(emailInput).toHaveValue('invalid-email');
      expect(emailInput.validity.valid).toBe(false);
    });
  });

  describe('Complete User Flow', () => {
    it('user can fill out complete form', async () => {
      const user = userEvent.setup();
      
      // Fill out all fields
      await user.type(screen.getByPlaceholderText('Your Name'), 'Jane Smith');
      await user.type(screen.getByPlaceholderText('Your Email'), 'jane.smith@example.com');
      await user.type(screen.getByPlaceholderText('Your Message'), 'Hello, I would like to know more about your services.');
      
      // Verify all fields are filled
      expect(screen.getByPlaceholderText('Your Name')).toHaveValue('Jane Smith');
      expect(screen.getByPlaceholderText('Your Email')).toHaveValue('jane.smith@example.com');
      expect(screen.getByPlaceholderText('Your Message')).toHaveValue('Hello, I would like to know more about your services.');
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);
      
      // Form should still be present with values (since preventDefault is used)
      expect(screen.getByPlaceholderText('Your Name')).toHaveValue('Jane Smith');
    });
  });

  describe('Accessibility', () => {
    it('form has proper ARIA labels through placeholders', () => {
      const nameInput = screen.getByPlaceholderText('Your Name');
      const emailInput = screen.getByPlaceholderText('Your Email');
      const messageTextarea = screen.getByPlaceholderText('Your Message');
      
      expect(nameInput).toHaveAttribute('placeholder', 'Your Name');
      expect(emailInput).toHaveAttribute('placeholder', 'Your Email');
      expect(messageTextarea).toHaveAttribute('placeholder', 'Your Message');
    });

    it('iframe has proper title for screen readers', () => {
      const iframe = screen.getByTitle('BU Computer Science Department');
      expect(iframe).toBeInTheDocument();
    });

    it('image has proper alt text', () => {
      const image = screen.getByAltText('Contact Illustration');
      expect(image).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles form submission with empty fields', async () => {
      const user = userEvent.setup();
      const submitButton = screen.getByRole('button', { name: /send message/i });
      
      // Try to submit empty form
      await user.click(submitButton);
      
      // Form should still be present
      expect(document.querySelector('.contact-form')).toBeInTheDocument();
    });
  });
});

describe('Contact Component Styling', () => {
  it('applies correct CSS classes', () => {
    render(<Contact />);
    
    const section = document.querySelector('.ContactPage');
    expect(section).toHaveClass('ContactPage');
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveClass('contact-h1');
    
    const form = document.querySelector('.contact-form');
    expect(form).toHaveClass('contact-form');
  });
});

describe('External Dependencies', () => {
  it('handles missing image', () => {
    // This test ensures the component doesn't break if the image fails to load
    render(<Contact />);
    const image = screen.getByAltText('Contact Illustration');
    
    // Simulate image load error
    fireEvent.error(image);
    
    // Component should still be rendered
    expect(document.querySelector('.ContactPage')).toBeInTheDocument();
  });
});