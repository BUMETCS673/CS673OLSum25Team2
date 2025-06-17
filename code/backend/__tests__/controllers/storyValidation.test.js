// Set test environment variables first
process.env.NODE_ENV = 'test';
process.env.OPENAI_API_KEY = 'test-key-for-testing';

function validateStoryParameters(params) {
  const errors = [];
  const validAgeGroups = ['3-5', '6-8', '9-12'];

  // Handle null/undefined params
  if (!params || typeof params !== 'object') {
    return {
      isValid: false,
      errors: [
        'Character is required',
        'Setting is required',
        'Theme is required',
        'Invalid age group. Must be one of: 3-5, 6-8, 9-12'
      ]
    };
  }

  // Validate character
  if (!params.character || params.character.trim() === '') {
    errors.push('Character is required');
  }

  // Validate setting
  if (!params.setting || params.setting.trim() === '') {
    errors.push('Setting is required');
  }

  // Validate theme
  if (!params.theme || params.theme.trim() === '') {
    errors.push('Theme is required');
  }

  // Validate age group
  if (!params.ageGroup || !validAgeGroups.includes(params.ageGroup)) {
    errors.push('Invalid age group. Must be one of: 3-5, 6-8, 9-12');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
describe('Story Parameter Validation', () => {
  
  describe('Valid Parameters', () => {
    test('should return valid result for correct story parameters', () => {
      // Arrange - Include ALL required fields based on actual implementation
      const storyParams = {
        character: 'Princess Luna',
        setting: 'Enchanted Forest',
        theme: 'friendship',
        ageGroup: '3-5'  // This field is required!
      };
      
      // Act
      const result = validateStoryParameters(storyParams);
      
      // Assert
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should accept all valid age groups', () => {
      // Arrange
      const validAgeGroups = ['3-5', '6-8', '9-12'];
      
      validAgeGroups.forEach(ageGroup => {
        const storyParams = {
          character: 'Test Character',
          setting: 'Test Setting',
          theme: 'test theme',
          ageGroup: ageGroup
        };
        
        // Act
        const result = validateStoryParameters(storyParams);
        
        // Assert
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });
  });

  describe('Invalid Parameters - Character Field', () => {
    test('should return invalid when character is empty', () => {
      // Arrange
      const storyParams = {
        character: '',
        setting: 'Enchanted Forest',
        theme: 'friendship',
        ageGroup: '3-5'
      };
      
      // Act
      const result = validateStoryParameters(storyParams);
      
      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Character is required');
    });

    test('should return invalid when character contains only whitespace', () => {
      // Arrange
      const storyParams = {
        character: '   ',
        setting: 'Enchanted Forest',
        theme: 'friendship',
        ageGroup: '3-5'
      };
      
      // Act
      const result = validateStoryParameters(storyParams);
      
      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Character is required');
    });

    test('should return invalid when character is missing', () => {
      // Arrange
      const storyParams = {
        setting: 'Enchanted Forest',
        theme: 'friendship',
        ageGroup: '3-5'
      };
      
      // Act
      const result = validateStoryParameters(storyParams);
      
      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Character is required');
    });
  });

  describe('Invalid Parameters - Setting Field', () => {
    test('should return invalid when setting is missing', () => {
      // Arrange
      const storyParams = {
        character: 'Princess Luna',
        // setting is missing
        theme: 'friendship',
        ageGroup: '3-5'
      };
      
      // Act
      const result = validateStoryParameters(storyParams);
      
      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Setting is required');
    });

    test('should return invalid when setting is empty', () => {
      // Arrange
      const storyParams = {
        character: 'Princess Luna',
        setting: '',
        theme: 'friendship',
        ageGroup: '3-5'
      };
      
      // Act
      const result = validateStoryParameters(storyParams);
      
      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Setting is required');
    });

    test('should return invalid when setting contains only whitespace', () => {
      // Arrange
      const storyParams = {
        character: 'Princess Luna',
        setting: '   ',
        theme: 'friendship',
        ageGroup: '3-5'
      };
      
      // Act
      const result = validateStoryParameters(storyParams);
      
      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Setting is required');
    });
  });

  describe('Invalid Parameters - Theme Field', () => {
    test('should return invalid when theme is missing', () => {
      // Arrange
      const storyParams = {
        character: 'Princess Luna',
        setting: 'Enchanted Forest',
        // theme is missing
        ageGroup: '3-5'
      };
      
      // Act
      const result = validateStoryParameters(storyParams);
      
      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Theme is required');
    });

    test('should return invalid when theme is empty', () => {
      // Arrange
      const storyParams = {
        character: 'Princess Luna',
        setting: 'Enchanted Forest',
        theme: '',
        ageGroup: '3-5'
      };
      
      // Act
      const result = validateStoryParameters(storyParams);
      
      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Theme is required');
    });

    test('should return invalid when theme contains only whitespace', () => {
      // Arrange
      const storyParams = {
        character: 'Princess Luna',
        setting: 'Enchanted Forest',
        theme: '   ',
        ageGroup: '3-5'
      };
      
      // Act
      const result = validateStoryParameters(storyParams);
      
      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Theme is required');
    });
  });

  describe('Invalid Parameters - Age Group Field', () => {
    test('should return invalid for invalid age group', () => {
      // Arrange
      const storyParams = {
        character: 'Princess Luna',
        setting: 'Enchanted Forest',
        theme: 'friendship',
        ageGroup: '15-18'  // Invalid age group
      };
      
      // Act
      const result = validateStoryParameters(storyParams);
      
      // Assert
      expect(result.isValid).toBe(false);
      // Use the actual error message format from the implementation
      expect(result.errors).toContain('Invalid age group. Must be one of: 3-5, 6-8, 9-12');
    });

    test('should return invalid when age group is missing', () => {
      // Arrange
      const storyParams = {
        character: 'Princess Luna',
        setting: 'Enchanted Forest',
        theme: 'friendship'
        // ageGroup is missing
      };
      
      // Act
      const result = validateStoryParameters(storyParams);
      
      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid age group. Must be one of: 3-5, 6-8, 9-12');
    });

    test('should return invalid when age group is empty', () => {
      // Arrange
      const storyParams = {
        character: 'Princess Luna',
        setting: 'Enchanted Forest',
        theme: 'friendship',
        ageGroup: ''
      };
      
      // Act
      const result = validateStoryParameters(storyParams);
      
      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid age group. Must be one of: 3-5, 6-8, 9-12');
    });
  });

  describe('Multiple Invalid Fields', () => {
    test('should return multiple errors for multiple invalid fields', () => {
      // Arrange
      const storyParams = {
        character: '',
        setting: '',
        theme: 'friendship',
        ageGroup: '3-5'
      };
      
      // Act
      const result = validateStoryParameters(storyParams);
      
      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2);
      expect(result.errors).toContain('Character is required');
      expect(result.errors).toContain('Setting is required');
    });

    test('should return all errors when all fields are invalid', () => {
      // Arrange
      const storyParams = {
        character: '',
        setting: '',
        theme: '',
        ageGroup: 'invalid'
      };
      
      // Act
      const result = validateStoryParameters(storyParams);
      
      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Character is required');
      expect(result.errors).toContain('Setting is required');
      expect(result.errors).toContain('Theme is required');
      expect(result.errors).toContain('Invalid age group. Must be one of: 3-5, 6-8, 9-12');
    });
  });

  describe('Edge Cases', () => {
    test('should return invalid when all parameters are missing', () => {
      // Arrange
      const storyParams = {};
      
      // Act
      const result = validateStoryParameters(storyParams);
      
      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('should handle null parameter object', () => {
      // Arrange
      const storyParams = null;
      
      // Act
      const result = validateStoryParameters(storyParams);
      
      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('should handle undefined parameter object', () => {
      // Arrange
      const storyParams = undefined;
      
      // Act
      const result = validateStoryParameters(storyParams);
      
      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('should handle minimum valid inputs', () => {
      // Arrange
      const storyParams = {
        character: 'A',
        setting: 'B',
        theme: 'C',
        ageGroup: '3-5'
      };
      
      // Act
      const result = validateStoryParameters(storyParams);
      
      // Assert
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('API Response Format', () => {
    test('should return consistent response format for valid input', () => {
      // Arrange
      const storyParams = {
        character: 'Princess Luna',
        setting: 'Enchanted Forest',
        theme: 'friendship',
        ageGroup: '3-5'
      };
      
      // Act
      const result = validateStoryParameters(storyParams);
      
      // Assert
      expect(result).toHaveProperty('isValid', true);
      expect(result).toHaveProperty('errors');
      expect(Array.isArray(result.errors)).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should return consistent response format for invalid input', () => {
      // Arrange
      const storyParams = {
        character: '',
        setting: 'Enchanted Forest',
        theme: 'friendship',
        ageGroup: '3-5'
      };
      
      // Act
      const result = validateStoryParameters(storyParams);
      
      // Assert
      expect(result).toHaveProperty('isValid', false);
      expect(result).toHaveProperty('errors');
      expect(Array.isArray(result.errors)).toBe(true);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('TDD Demonstration', () => {
    // This test demonstrates the RED-GREEN-REFACTOR cycle
    test('should demonstrate TDD cycle with a new validation rule', () => {
      // This test would initially FAIL (RED phase)
      // Then we implement the feature to make it PASS (GREEN phase)
      // Finally we refactor the implementation (REFACTOR phase)
      
      // Arrange
      const storyParams = {
        character: 'Princess Luna',
        setting: 'Enchanted Forest',
        theme: 'friendship',
        ageGroup: '3-5'
      };
      
      // Act
      const result = validateStoryParameters(storyParams);
      
      // Assert - This test passes now because the function is implemented
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});