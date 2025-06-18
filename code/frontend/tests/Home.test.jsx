import React from 'react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Home from '../src/pages/Home/Home';
import { useNavigate } from 'react-router-dom';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock('../../assets/main_screen_image.png', () => ({
  default: 'mocked-main-image.png',
}));

describe('Home Component', () => {
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderHome = () => {
    return render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
  };

  describe('Component Rendering', () => {
    it('should render the home section', () => {
      renderHome();
      
      const homeSection = document.querySelector('.Home');
      expect(homeSection).toBeInTheDocument();
    });

    it('should render the main container with correct classes', () => {
      renderHome();
      
      const mainContainer = document.querySelector('.main-container.home-screen-container');
      expect(mainContainer).toBeInTheDocument();
    });

    it('should render the main image', () => {
        renderHome();

        const mainImage = screen.getByAltText('Main');
        expect(mainImage).toBeInTheDocument();
        expect(mainImage).toHaveClass('main-image');
        expect(mainImage).toHaveAttribute('src', '/src/assets/main_screen_image.png');
    });

    it('should render the home text overlay', () => {
      renderHome();
      
      const textOverlay = document.querySelector('.home-text-overlay');
      expect(textOverlay).toBeInTheDocument();
    });
  });

  describe('Content Display', () => {
    it('should display the main heading', () => {
      renderHome();
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('MY MAGICAL BEDTIME');
    });

    it('should display the subheading', () => {
      renderHome();
      
      const subheading = screen.getByRole('heading', { level: 3 });
      expect(subheading).toHaveTextContent('A new adventure every night!');
    });

    it('should display the generate story button', () => {
      renderHome();
      
      const button = screen.getByRole('button', { name: 'GENERATE A STORY' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('home-main-btn');
    });
  });

  describe('User Interactions', () => {
    it('should navigate to generate story page when button is clicked', async () => {
      renderHome();
      const user = userEvent.setup();
      
      const generateButton = screen.getByRole('button', { name: 'GENERATE A STORY' });
      await user.click(generateButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('/generatestory');
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });

    it('should handle button click with fireEvent', () => {
      renderHome();
      
      const generateButton = screen.getByRole('button', { name: 'GENERATE A STORY' });
      fireEvent.click(generateButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('/generatestory');
    });

    it('should not navigate when clicking outside the button', async () => {
      renderHome();
      const user = userEvent.setup();
      
      const textOverlay = document.querySelector('.home-text-overlay');
      await user.click(textOverlay);
      
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      renderHome();
      
      const h1 = screen.getByRole('heading', { level: 1 });
      const h3 = screen.getByRole('heading', { level: 3 });
      
      expect(h1).toBeInTheDocument();
      expect(h3).toBeInTheDocument();
    });

    it('should have descriptive alt text for the main image', () => {
      renderHome();
      
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', 'Main');
    });

    it('should have an accessible button', () => {
      renderHome();
      
      const button = screen.getByRole('button');
      expect(button).toHaveAccessibleName('GENERATE A STORY');
    });
  });

  describe('Layout Structure', () => {
    it('should have correct DOM structure', () => {
      const { container } = renderHome();
      
      const homeSection = container.querySelector('.Home');
      const mainContainer = homeSection.querySelector('.main-container.home-screen-container');
      const image = mainContainer.querySelector('img.main-image');
      const textOverlay = mainContainer.querySelector('.home-text-overlay');
      const h1 = textOverlay.querySelector('h1');
      const h3 = textOverlay.querySelector('h3');
      const button = textOverlay.querySelector('button.home-main-btn');
      
      expect(homeSection).toBeInTheDocument();
      expect(mainContainer).toBeInTheDocument();
      expect(image).toBeInTheDocument();
      expect(textOverlay).toBeInTheDocument();
      expect(h1).toBeInTheDocument();
      expect(h3).toBeInTheDocument();
      expect(button).toBeInTheDocument();
    });

    it('should render all elements in correct order', () => {
      renderHome();
      
      const textOverlay = document.querySelector('.home-text-overlay');
      const children = Array.from(textOverlay.children);
      
      expect(children[0].tagName).toBe('H1');
      expect(children[1].tagName).toBe('H3');
      expect(children[2].tagName).toBe('BUTTON');
    });
  });

  describe('Component Integration', () => {
    it('should work with React Router', () => {
      renderHome();
      
      // Verify the component renders without router errors
      expect(screen.getByRole('button', { name: 'GENERATE A STORY' })).toBeInTheDocument();
      
      // Verify navigation hook is called
      expect(useNavigate).toHaveBeenCalled();
    });

    it('should maintain navigation functionality after re-render', () => {
      const { rerender } = renderHome();
      
      const button = screen.getByRole('button', { name: 'GENERATE A STORY' });
      fireEvent.click(button);
      
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      
      // Re-render the component
      rerender(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );
      
      const buttonAfterRerender = screen.getByRole('button', { name: 'GENERATE A STORY' });
      fireEvent.click(buttonAfterRerender);
      
      expect(mockNavigate).toHaveBeenCalledTimes(2);
    });
  });

  describe('Performance', () => {
    it('should not create multiple event listeners on re-render', () => {
      const { rerender } = renderHome();
      
      const button = screen.getByRole('button', { name: 'GENERATE A STORY' });
      fireEvent.click(button);
      
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      
      // Re-render multiple times
      rerender(<BrowserRouter><Home /></BrowserRouter>);
      rerender(<BrowserRouter><Home /></BrowserRouter>);
      rerender(<BrowserRouter><Home /></BrowserRouter>);
      
      // Click again
      fireEvent.click(button);
      
      // Should only have been called twice total (once before, once after)
      expect(mockNavigate).toHaveBeenCalledTimes(2);
    });
  });

  describe('Visual States', () => {
    it('should apply correct CSS classes', () => {
      renderHome();
      
      expect(document.querySelector('.Home')).toBeInTheDocument();
      expect(document.querySelector('.main-container')).toHaveClass('home-screen-container');
      expect(screen.getByAltText('Main')).toHaveClass('main-image');
      expect(document.querySelector('.home-text-overlay')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveClass('home-main-btn');
    });

    it('should maintain layout structure', () => {
      renderHome();
      
      const mainContainer = document.querySelector('.main-container');
      const children = Array.from(mainContainer.children);
      
      // Should have image and text overlay as direct children
      expect(children).toHaveLength(2);
      expect(children[0]).toHaveClass('main-image');
      expect(children[1]).toHaveClass('home-text-overlay');
    });
  });

  describe('Button Behavior', () => {
    it('should be clickable', () => {
      renderHome();
      
      const button = screen.getByRole('button', { name: 'GENERATE A STORY' });
      expect(button).not.toBeDisabled();
      expect(button).toBeVisible();
    });

    it('should handle multiple rapid clicks', async () => {
      renderHome();
      const user = userEvent.setup();
      
      const button = screen.getByRole('button', { name: 'GENERATE A STORY' });
      
      // Rapid clicks
      await user.click(button);
      await user.click(button);
      await user.click(button);
      
      // Should navigate for each click
      expect(mockNavigate).toHaveBeenCalledTimes(3);
      expect(mockNavigate).toHaveBeenCalledWith('/generatestory');
    });
  });
});
