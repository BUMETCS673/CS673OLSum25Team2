import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Contact from '../src/pages/Contact/Contact';

describe('Contact Component', () => {
  beforeEach(() => {
    // Clear any previous renders
    vi.clearAllMocks();
  });

  const renderContact = () => {
    return render(<Contact />);
  };

  describe('Component Structure', () => {
    it('should render the contact page container', () => {
      renderContact();
      expect(document.querySelector('.ContactPage')).toBeInTheDocument();
    });

    it('should render the main heading', () => {
      renderContact();
      expect(screen.getByText('Get in Touch!')).toBeInTheDocument();
    });

    it('should render the introductory text', () => {
      renderContact();
      expect(screen.getByText("We'd love to hear from you! Fill out the form or reach out directly.")).toBeInTheDocument();
    });
  });

  describe('Contact Form', () => {
    it('should render the contact form', () => {
      renderContact();
      const form = document.querySelector('.contact-form');
      expect(form).toBeInTheDocument();
    });

    it('should render name input field', () => {
      renderContact();
      const nameInput = screen.getByPlaceholderText('Your Name');
      expect(nameInput).toBeInTheDocument();
      expect(nameInput).toHaveAttribute('type', 'text');
      expect(nameInput).toHaveAttribute('name', 'name');
      expect(nameInput).toBeRequired();
    });

    it('should render email input field', () => {
      renderContact();
      const emailInput = screen.getByPlaceholderText('Your Email');
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('name', 'email');
      expect(emailInput).toBeRequired();
    });

    it('should render message textarea', () => {
      renderContact();
      const messageTextarea = screen.getByPlaceholderText('Your Message or Feedback');
      expect(messageTextarea).toBeInTheDocument();
      expect(messageTextarea).toHaveAttribute('name', 'message');
      expect(messageTextarea).toHaveAttribute('rows', '5');
      expect(messageTextarea).toBeRequired();
    });

    it('should render submit button', () => {
      renderContact();
      const submitButton = screen.getByRole('button', { name: 'SEND MESSAGE' });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('type', 'submit');
      expect(submitButton).toHaveClass('contact-submit-btn');
    });

    it('should allow user to type in name field', async () => {
      renderContact();
      const user = userEvent.setup();
      
      const nameInput = screen.getByPlaceholderText('Your Name');
      await user.type(nameInput, 'John Doe');
      
      expect(nameInput).toHaveValue('John Doe');
    });

    it('should allow user to type in email field', async () => {
      renderContact();
      const user = userEvent.setup();
      
      const emailInput = screen.getByPlaceholderText('Your Email');
      await user.type(emailInput, 'john@example.com');
      
      expect(emailInput).toHaveValue('john@example.com');
    });

    it('should allow user to type in message field', async () => {
      renderContact();
      const user = userEvent.setup();
      
      const messageTextarea = screen.getByPlaceholderText('Your Message or Feedback');
      await user.type(messageTextarea, 'This is a test message');
      
      expect(messageTextarea).toHaveValue('This is a test message');
    });

    it('should validate email format', async () => {
      renderContact();
      const user = userEvent.setup();
      
      const emailInput = screen.getByPlaceholderText('Your Email');
      const submitButton = screen.getByRole('button', { name: 'SEND MESSAGE' });
      
      // Type invalid email
      await user.type(emailInput, 'invalid-email');
      
      // Email input should have invalid state
      expect(emailInput.validity.valid).toBe(false);
    });
  });

  describe('Contact Information Section', () => {
    it('should render contact information heading', () => {
      renderContact();
      expect(screen.getByText('Contact Information')).toBeInTheDocument();
    });

    it('should render email information', () => {
      renderContact();
      expect(screen.getByText('Email:')).toBeInTheDocument();
      expect(screen.getByText('support@mymagicalbedtime.com')).toBeInTheDocument();
    });

    it('should render phone information', () => {
      renderContact();
      expect(screen.getByText('Phone:')).toBeInTheDocument();
      expect(screen.getByText('(617) 353-8919')).toBeInTheDocument();
    });

    it('should render location heading', () => {
      renderContact();
      expect(screen.getByText('Location:')).toBeInTheDocument();
    });

    it('should render complete address', () => {
      renderContact();
      expect(screen.getByText('Department of Computer Science')).toBeInTheDocument();
      expect(screen.getByText('Boston University')).toBeInTheDocument();
      expect(screen.getByText('665 Commonwealth Avenue')).toBeInTheDocument();
      expect(screen.getByText('Boston, MA 02215')).toBeInTheDocument();
    });

    it('should have contact info section with proper class', () => {
      renderContact();
      const infoSection = document.querySelector('.contact-info');
      expect(infoSection).toBeInTheDocument();
    });
  });

  describe('Map Section', () => {
    it('should render the map container', () => {
      renderContact();
      const mapContainer = document.querySelector('.contact-map');
      expect(mapContainer).toBeInTheDocument();
    });

    it('should render the Google Maps iframe', () => {
      renderContact();
      const iframe = screen.getByTitle('BU Computer Science Department');
      expect(iframe).toBeInTheDocument();
    });

    it('should render map in correct section', () => {
      renderContact();
      const mapSection = document.querySelector('.contact-info-map-section');
      const mapContainer = mapSection.querySelector('.contact-map');
      expect(mapContainer).toBeInTheDocument();
    });
  });

  describe('Layout and Styling', () => {
    it('should have correct class names for styling', () => {
      renderContact();
      
      expect(document.querySelector('.ContactPage')).toBeInTheDocument();
      expect(document.querySelector('.contact-container')).toBeInTheDocument();
      expect(document.querySelector('.contact-form')).toBeInTheDocument();
      expect(document.querySelector('.contact-info-map-section')).toBeInTheDocument();
    });

    it('should have contact input fields with correct class', () => {
      renderContact();
      
      const nameInput = screen.getByPlaceholderText('Your Name');
      const emailInput = screen.getByPlaceholderText('Your Email');
      
      expect(nameInput).toHaveClass('contact-input');
      expect(emailInput).toHaveClass('contact-input');
    });

    it('should have textarea with correct class', () => {
      renderContact();
      
      const textarea = screen.getByPlaceholderText('Your Message or Feedback');
      expect(textarea).toHaveClass('contact-textarea');
    });
  });

  describe('Accessibility', () => {
    it('should have accessible form labels through placeholders', () => {
      renderContact();
      
      expect(screen.getByPlaceholderText('Your Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Your Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Your Message or Feedback')).toBeInTheDocument();
    });

    it('should have required attributes on form fields', () => {
      renderContact();
      
      const nameInput = screen.getByPlaceholderText('Your Name');
      const emailInput = screen.getByPlaceholderText('Your Email');
      const messageTextarea = screen.getByPlaceholderText('Your Message or Feedback');
      
      expect(nameInput).toBeRequired();
      expect(emailInput).toBeRequired();
      expect(messageTextarea).toBeRequired();
    });

    it('should have proper heading hierarchy', () => {
      renderContact();
      
      const h2 = screen.getByRole('heading', { level: 2, name: 'Get in Touch!' });
      const h3 = screen.getByRole('heading', { level: 3, name: 'Contact Information' });
      const h4 = screen.getByRole('heading', { level: 4, name: 'Location:' });
      
      expect(h2).toBeInTheDocument();
      expect(h3).toBeInTheDocument();
      expect(h4).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should not submit with empty fields', async () => {
      renderContact();
      const user = userEvent.setup();
      
      const submitButton = screen.getByRole('button', { name: 'SEND MESSAGE' });
      const form = document.querySelector('.contact-form');
      
      // Check form validity before submission
      expect(form.checkValidity()).toBe(false);
      
      await user.click(submitButton);
      
      // Form should still be on the page (not submitted)
      expect(form).toBeInTheDocument();
    });

    it('should accept valid form data', async () => {
      renderContact();
      const user = userEvent.setup();
      
      const nameInput = screen.getByPlaceholderText('Your Name');
      const emailInput = screen.getByPlaceholderText('Your Email');
      const messageTextarea = screen.getByPlaceholderText('Your Message or Feedback');
      
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(messageTextarea, 'This is a test message');
      
      const form = document.querySelector('.contact-form');
      expect(form.checkValidity()).toBe(true);
    });
  });

  describe('Integration', () => {
    it('should render all sections in correct order', () => {
      renderContact();
      
      const containers = document.querySelectorAll('.contact-container');
      
      // First container should have the form
      expect(containers[0].querySelector('.contact-form')).toBeInTheDocument();
      
      // Second container should have contact info and map
      expect(containers[1].querySelector('.contact-info')).toBeInTheDocument();
      expect(containers[1].querySelector('.contact-map')).toBeInTheDocument();
    });

    it('should maintain form state across interactions', async () => {
      renderContact();
      const user = userEvent.setup();
      
      const nameInput = screen.getByPlaceholderText('Your Name');
      const emailInput = screen.getByPlaceholderText('Your Email');
      
      await user.type(nameInput, 'John');
      await user.type(emailInput, 'john@test.com');
      
      // Values should persist
      expect(nameInput).toHaveValue('John');
      expect(emailInput).toHaveValue('john@test.com');
      
      // Continue typing
      await user.type(nameInput, ' Doe');
      expect(nameInput).toHaveValue('John Doe');
    });
  });
});
