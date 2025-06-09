import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, beforeEach, vi, within } from 'vitest';
import About from '../src/pages/About/About';

// Mock the CSS import
vi.mock('./About.css', () => ({}));

// Mock the image import
vi.mock('../src/assets/signin_image.png', () => ({ 
  default: 'mocked-signin-image.png' 
}));

describe('About Component', () => {
  beforeEach(() => {
    render(<About />);
  });

  describe('Component Structure', () => {
    it('renders main about section', () => {
      const aboutSection = document.querySelector('.About');
      expect(aboutSection).toBeInTheDocument();
      expect(aboutSection).toHaveClass('About');
    });

    it('renders main heading', () => {
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('MY MAGICAL BEDTIME');
      expect(heading).toHaveClass('about-h1');
    });

    it('renders about box container', () => {
      const aboutBox = document.querySelector('.about-box');
      expect(aboutBox).toBeInTheDocument();
      expect(aboutBox).toHaveClass('about-box');
    });

    it('renders about image', () => {
      const aboutImage = screen.getByRole('img', { name: /bedtime story illustration/i });
      expect(aboutImage).toBeInTheDocument();
      expect(aboutImage).toHaveAttribute('src', 'mocked-signin-image.png');
      expect(aboutImage).toHaveClass('about-image');
    });
  });

  describe('Content Sections', () => {
    it('renders welcome section', () => {
      const welcomeHeading = screen.getByRole('heading', { name: /welcome to my magical bedtime/i });
      expect(welcomeHeading).toBeInTheDocument();
      expect(welcomeHeading).toHaveTextContent('Welcome to My Magical Bedtime');
    });

    it('displays welcome description', () => {
      const welcomeText = screen.getByText(/My Magical Bedtime is an interactive story generator designed for preschool children ages 3 to 5/i);
      expect(welcomeText).toBeInTheDocument();
    });

    it('renders "Why We Built This" section', () => {
      const whyHeading = screen.getByRole('heading', { name: /why we built this/i });
      expect(whyHeading).toBeInTheDocument();
      expect(whyHeading).toHaveTextContent('Why We Built This');
    });

    it('displays why we built this description', () => {
      const whyText = screen.getByText(/Bedtime storytelling can be a challenge after a long day/i);
      expect(whyText).toBeInTheDocument();
    });

    it('renders "Our Purpose" section', () => {
      const purposeHeading = screen.getByRole('heading', { name: /our purpose/i });
      expect(purposeHeading).toBeInTheDocument();
      expect(purposeHeading).toHaveTextContent('Our Purpose');
    });

    it('displays our purpose description', () => {
      const purposeText = screen.getByText(/We aim to make bedtime more meaningful/i);
      expect(purposeText).toBeInTheDocument();
    });

    it('renders "Who It\'s For" section', () => {
      const whoHeading = screen.getByRole('heading', { name: /who it's for/i });
      expect(whoHeading).toBeInTheDocument();
      expect(whoHeading).toHaveTextContent("Who It's For");
    });

    it('displays who it\'s for description', () => {
      const whoText = screen.getByText(/Designed for parents and caregivers to enjoy with preschoolers/i);
      expect(whoText).toBeInTheDocument();
    });
  });

  describe('Team Section', () => {
    it('renders "Meet the Team" section', () => {
      const teamHeading = screen.getByRole('heading', { name: /meet the team/i });
      expect(teamHeading).toBeInTheDocument();
      expect(teamHeading).toHaveTextContent('Meet the Team');
    });

    it('displays all team members', () => {
      // Test each team member
      expect(screen.getByText(/Hongjie Zhang/i)).toBeInTheDocument();
      expect(screen.getByText(/Tetiana Korchynska/i)).toBeInTheDocument();
      expect(screen.getByText(/Iqra Chaudhary/i)).toBeInTheDocument();
      expect(screen.getByText(/Thomas Iliev/i)).toBeInTheDocument();
      expect(screen.getByText(/Grant Hovey/i)).toBeInTheDocument();
      expect(screen.getByText(/Xuelin Min/i)).toBeInTheDocument();
    });

    it('displays team member roles', () => {
      expect(screen.getByText(/Design & Implementation Lead, Security Lead/i)).toBeInTheDocument();
      expect(screen.getByText(/Requirement Lead, Design & Implementation Lead/i)).toBeInTheDocument();
      expect(screen.getByText(/Team Lead/i)).toBeInTheDocument();
      expect(screen.getByText(/QA Lead/i)).toBeInTheDocument();
      expect(screen.getByText(/Configuration Lead/i)).toBeInTheDocument();
    });
  });

  describe('Content Flow', () => {
    it('content sections appear in logical order', () => {
      const headings = screen.getAllByRole('heading');
      const headingTexts = headings.map(h => h.textContent);
      
      const expectedOrder = [
        'MY MAGICAL BEDTIME',
        'Welcome to My Magical Bedtime',
        'Why We Built This',
        'Our Purpose',
        "Who It's For",
        'Meet the Team'
      ];
      
      expect(headingTexts).toEqual(expectedOrder);
    });
  });

  describe('Accessibility', () => {
    it('image has proper alt text', () => {
      const image = screen.getByAltText('Bedtime story illustration');
      expect(image).toBeInTheDocument();
    });

    it('headings are properly structured for screen readers', () => {
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
      
      // Check that we have the main heading
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent('MY MAGICAL BEDTIME');
    });

    it('strong tags are used for team member emphasis', () => {
      const strongElements = document.querySelectorAll('strong');
      expect(strongElements.length).toBe(6); // One for each team member
    });
  });

  describe('CSS Classes', () => {
    it('applies correct CSS classes to main elements', () => {
      const section = document.querySelector('.About');
      expect(section).toHaveClass('About');
      
      const header = document.querySelector('.about-header');
      expect(header).toBeInTheDocument();
      
      const rightPanel = document.querySelector('.about-right');
      expect(rightPanel).toBeInTheDocument();
      
      const box = document.querySelector('.about-box');
      expect(box).toHaveClass('about-box');
      
      const bottomImage = document.querySelector('.about-bottom-image');
      expect(bottomImage).toBeInTheDocument();
    });

    it('main heading has correct class', () => {
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveClass('about-h1');
    });

    it('image has correct class', () => {
      const image = screen.getByAltText('Bedtime story illustration');
      expect(image).toHaveClass('about-image');
    });
  });

  describe('Error Handling', () => {
    it('handles missing image', () => {
      const image = screen.getByAltText('Bedtime story illustration');
      
      // Simulate image load error
      fireEvent.error(image);
      
      // Component should still be rendered
      expect(document.querySelector('.About')).toBeInTheDocument();
    });

    it('component renders without crashing', () => {
      // This test ensures the component doesn't throw errors during render
      expect(document.querySelector('.About')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });
});