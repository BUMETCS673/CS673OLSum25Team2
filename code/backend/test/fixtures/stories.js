// test/fixtures/stories.js

const validStoryParams = {
  character: 'Princess Luna',
  setting: 'Enchanted Forest',
  theme: 'friendship',
  style: 'watercolor',
  ageGroup: '3-5'
};

const validStoryResponse = {
  title: 'Princess Luna and the Magic Forest',
  story: 'Once upon a time, Princess Luna lived in an enchanted forest where she learned the value of friendship through magical adventures with woodland creatures. She met a shy rabbit named Whiskers and a wise old owl named Oliver. Together, they discovered that sharing and caring made their forest home even more beautiful.',
  summary: 'A heartwarming tale about Princess Luna discovering friendship in an enchanted forest.',
  imageDescription: 'A beautiful princess with flowing hair in a magical forest surrounded by friendly woodland animals, painted in soft watercolors with warm, dreamy lighting.'
};

const invalidStoryParams = {
  empty: {
    character: '',
    setting: 'Enchanted Forest',
    theme: 'friendship',
    style: 'watercolor'
  },
  missing: {
    character: 'Princess Luna',
    // setting is missing
    theme: 'friendship',
    style: 'watercolor'
  },
  tooLong: {
    character: 'Princess Luna',
    setting: 'Enchanted Forest',
    theme: 'a very very very very very very very very very very very very very very very very very very very long theme that exceeds the maximum allowed length for themes in our story generation system',
    style: 'watercolor'
  },
  invalidStyle: {
    character: 'Princess Luna',
    setting: 'Enchanted Forest',
    theme: 'friendship',
    style: 'invalid-style'
  },
  whitespace: {
    character: '   ',
    setting: '  \t  ',
    theme: 'friendship',
    style: 'watercolor'
  },
  nullValues: {
    character: null,
    setting: null,
    theme: null,
    style: null
  }
};

const multipleStories = [
  {
    ...validStoryResponse,
    ...validStoryParams,
    _id: '507f1f77bcf86cd799439011',
    createdAt: new Date('2023-01-01T10:00:00Z')
  },
  {
    title: 'Captain Leo\'s Mountain Adventure',
    story: 'Captain Leo was a brave young explorer who lived in the mountain kingdom. One day, he discovered a hidden cave filled with glowing crystals that taught him about courage and perseverance.',
    summary: 'An exciting adventure about Captain Leo learning courage in the mountains.',
    imageDescription: 'A brave young captain with a red cape standing at the entrance of a glowing crystal cave in the mountains.',
    character: 'Captain Leo',
    setting: 'Mountain Kingdom',
    theme: 'courage',
    style: 'cartoon',
    ageGroup: '6-8',
    _id: '507f1f77bcf86cd799439012',
    createdAt: new Date('2023-01-02T10:00:00Z')
  },
  {
    title: 'Maya the Scientist\'s Discovery',
    story: 'Maya was a curious scientist who loved to experiment. In her laboratory, she discovered a formula that could make plants grow faster, teaching her about responsibility and the importance of using knowledge wisely.',
    summary: 'A story about Maya the scientist learning responsibility through her discoveries.',
    imageDescription: 'A young scientist girl in a colorful laboratory surrounded by growing plants and bubbling beakers.',
    character: 'Maya the Scientist',
    setting: 'Science Laboratory',
    theme: 'responsibility',
    style: 'realistic',
    ageGroup: '9-12',
    _id: '507f1f77bcf86cd799439013',
    createdAt: new Date('2023-01-03T10:00:00Z')
  }
];

const storyValidationRules = {
  character: {
    required: true,
    minLength: 1,
    maxLength: 50,
    type: 'string'
  },
  setting: {
    required: true,
    minLength: 1,
    maxLength: 50,
    type: 'string'
  },
  theme: {
    required: true,
    minLength: 1,
    maxLength: 100,
    type: 'string'
  },
  style: {
    required: true,
    allowedValues: ['watercolor', 'cartoon', 'realistic', 'sketch', 'digital'],
    type: 'string'
  },
  ageGroup: {
    required: false,
    allowedValues: ['3-5', '6-8', '9-12'],
    type: 'string',
    default: '3-5'
  }
};

const apiResponses = {
  success: {
    story: {
      success: true,
      data: validStoryResponse
    },
    stories: {
      success: true,
      data: multipleStories
    },
    validation: {
      success: true,
      data: {
        isValid: true,
        errors: []
      }
    },
    deletion: {
      success: true,
      message: 'Story deleted successfully'
    }
  },
  error: {
    validation: {
      success: false,
      error: 'Invalid input parameters',
      details: 'Validation failed: Character is required'
    },
    notFound: {
      success: false,
      error: 'Story not found'
    },
    serverError: {
      success: false,
      error: 'Failed to generate story',
      details: 'Story generation failed: API Error'
    },
    databaseError: {
      success: true,
      data: validStoryResponse,
      warning: 'Story generated but not saved to database'
    }
  }
};

const openaiMockResponses = {
  validStoryGeneration: JSON.stringify(validStoryResponse),
  incompleteStory: JSON.stringify({
    title: 'Incomplete Story',
    story: 'This story is missing fields...'
    // Missing summary and imageDescription
  }),
  invalidJson: 'This is not valid JSON content',
  emptyFields: JSON.stringify({
    title: 'Story with Empty Fields',
    story: 'Some content',
    summary: '', // Empty field
    imageDescription: 'Valid description'
  })
};

module.exports = {
  validStoryParams,
  validStoryResponse,
  invalidStoryParams,
  multipleStories,
  storyValidationRules,
  apiResponses,
  openaiMockResponses
};