import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import About from '../src/pages/About/About';

describe('About Component', () => {
  beforeEach(() => {
    render(<About />);
  });

  describe('Component Structure', () => {
    it('should render the main section with correct class', () => {
      const section = document.querySelector('section.About');
      expect(section).toBeInTheDocument();
    });

    it('should render all container divs', () => {
      const containers = document.querySelectorAll('.about-container');
      expect(containers).toHaveLength(5);
    });
  });

  describe('Main Heading and Introduction', () => {
    it('should render the main heading', () => {
      const heading = screen.getByRole('heading', { 
        level: 2, 
        name: 'Welcome to My Magical Bedtime!' 
      });
      expect(heading).toBeInTheDocument();
    });

    it('should render the introduction paragraph', () => {
      const introText = screen.getByText(/My Magical Bedtime is an interactive story generator/i);
      expect(introText).toBeInTheDocument();
      expect(introText).toHaveTextContent('designed for preschool children ages 3 to 5');
    });
  });

  describe('Content Sections', () => {
    it('should render "Why We Built This" section', () => {
      const heading = screen.getByRole('heading', { 
        level: 3, 
        name: 'Why We Built This' 
      });
      expect(heading).toBeInTheDocument();
      
      const content = screen.getByText(/Bedtime storytelling can be a challenge/i);
      expect(content).toBeInTheDocument();
    });

    it('should render "Our Purpose" section', () => {
      const heading = screen.getByRole('heading', { 
        level: 3, 
        name: 'Our Purpose' 
      });
      expect(heading).toBeInTheDocument();
      
      const content = screen.getByText(/We aim to make bedtime more meaningful/i);
      expect(content).toBeInTheDocument();
    });

    it('should render "Who It\'s For" section', () => {
      const heading = screen.getByRole('heading', { 
        level: 3, 
        name: "Who It's For" 
      });
      expect(heading).toBeInTheDocument();
      
      const content = screen.getByText(/Designed for parents and caregivers/i);
      expect(content).toBeInTheDocument();
    });
  });

  describe('Team Section', () => {
    it('should render "Meet the Team" heading', () => {
      const heading = screen.getByRole('heading', { 
        level: 3, 
        name: 'Meet the Team' 
      });
      expect(heading).toBeInTheDocument();
    });

    const teamMembers = [
      { name: 'Hongjie Zhang', role: 'Design & Implementation Lead, Security Lead' },
      { name: 'Tetiana Korchynska', role: 'Requirement Lead, Design & Implementation Lead' },
      { name: 'Iqra Chaudhary', role: 'Team Lead' },
      { name: 'Thomas Iliev', role: 'QA Lead' },
      { name: 'Grant Hovey', role: 'Configuration Lead' },
      { name: 'Xuelin Min', role: 'Security Lead' }
    ];

    teamMembers.forEach(({ name, role }) => {
      it(`should render team member ${name} with correct role`, () => {
        // Find the name in a <strong> tag
        const memberName = screen.getByText(name);
        expect(memberName).toBeInTheDocument();
        expect(memberName.tagName).toBe('STRONG');
        
        // Find the paragraph containing both name and role
        const memberParagraph = memberName.closest('p');
        expect(memberParagraph).toBeInTheDocument();
        expect(memberParagraph).toHaveTextContent(`${name} — ${role}`);
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      const h2 = screen.getAllByRole('heading', { level: 2 });
      const h3 = screen.getAllByRole('heading', { level: 3 });
      
      expect(h2).toHaveLength(1);
      expect(h3).toHaveLength(4);
    });

    it('should have descriptive text for all sections', () => {
      const section = document.querySelector('.About');
      const paragraphs = section.querySelectorAll('p');

      paragraphs.forEach(paragraph => {
        expect(paragraph.textContent.length).toBeGreaterThan(15);
      });
    });
  });

  describe('CSS Classes', () => {
    it('should apply correct CSS classes', () => {
      const mainSection = document.querySelector('.About');
      expect(mainSection).toBeInTheDocument();
      
      const containers = document.querySelectorAll('.about-container');
      containers.forEach(container => {
        expect(container).toBeInTheDocument();
      });
    });
  });
});
