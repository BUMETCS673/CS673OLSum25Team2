import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Contact from '../src/pages/Contact/Contact';

// Mock the image import
vi.mock('/src/assets/main_screen_image.png', () => ({
  default: 'mocked-image-path'
}));

describe('Contact Component - Rendering', () => {
  it('should render all contact page elements', () => {
    const { container } = render(<Contact />);

    // Check main section
    const contactSection = container.querySelector('.Contact');
    expect(contactSection).toBeInTheDocument();

    // Check headings
    expect(screen.getByText('CONTACT US')).toBeInTheDocument();
    expect(screen.getByText("We'd love to hear from you!")).toBeInTheDocument();

    // Check image
    const contactImage = screen.getByAltText('Contact');
    expect(contactImage).toBeInTheDocument();
    expect(contactImage).toHaveClass('contact-image');
    expect(contactImage).toHaveAttribute('src', 'mocked-image-path');

    // Check name input
    const nameInput = screen.getByPlaceholderText('Name');
    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toHaveAttribute('type', 'text');
    expect(nameInput).toHaveAttribute('name', 'name');
    expect(nameInput).toBeRequired();
    expect(nameInput).toHaveClass('contact-input');

    // Check email input
    const emailInput = screen.getByPlaceholderText('Email');
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('name', 'email');
    expect(emailInput).toBeRequired();
    expect(emailInput).toHaveClass('contact-input');

    // Check message text
    const messageTextarea = screen.getByPlaceholderText('Message');
    expect(messageTextarea).toBeInTheDocument();
    expect(messageTextarea).toHaveAttribute('name', 'message');
    expect(messageTextarea).toBeRequired();
    expect(messageTextarea).toHaveAttribute('rows', '6');
    expect(messageTextarea).toHaveClass('contact-textarea');

    // Check submit button
    const submitButton = screen.getByRole('button', { name: /send message/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute('type', 'submit');
    expect(submitButton).toHaveClass('contact-submit-btn');
  });

  it('should have proper DOM structure', () => {
    const { container } = render(<Contact />);

    // Check main container structure
    const mainContainer = container.querySelector('.main-container');
    expect(mainContainer).toBeInTheDocument();
    expect(mainContainer).toHaveClass('main-container', 'contact-screen-container');

    // Check form overlay
    const formOverlay = container.querySelector('.contact-form-overlay');
    expect(formOverlay).toBeInTheDocument();

    // Check that form overlay contains the headings and form
    const h1 = screen.getByRole('heading', { level: 1 });
    const h3 = screen.getByRole('heading', { level: 3 });
    const form = container.querySelector('form');
    
    expect(h1).toBeInTheDocument();
    expect(h1).toHaveTextContent('CONTACT US');
    expect(h3).toBeInTheDocument();
    expect(h3).toHaveTextContent("We'd love to hear from you!");
    expect(form).toBeInTheDocument();
    expect(form).toHaveClass('contact-form');

    // Check that all form inputs are inside the form
    const formInputs = form?.querySelectorAll('input, textarea, button');
    expect(formInputs).toHaveLength(4);
  });

  it('should render with correct CSS classes', () => {
    const { container } = render(<Contact />);

    // Check all CSS classes are applied
    expect(container.querySelector('.Contact')).toBeInTheDocument();
    expect(container.querySelector('.main-container.contact-screen-container')).toBeInTheDocument();
    expect(container.querySelector('.contact-image')).toBeInTheDocument();
    expect(container.querySelector('.contact-form-overlay')).toBeInTheDocument();
    expect(container.querySelector('.contact-form')).toBeInTheDocument();
    
    const inputs = container.querySelectorAll('.contact-input');
    expect(inputs).toHaveLength(2);
    inputs.forEach(input => expect(input).toBeInTheDocument());
    
    expect(container.querySelector('.contact-textarea')).toBeInTheDocument();
    expect(container.querySelector('.contact-submit-btn')).toBeInTheDocument();
  });
});