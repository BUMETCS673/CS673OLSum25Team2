const joi = require('joi');

const storyGenerationSchema = joi.object({
  character: joi.string().required().min(1).max(50),
  setting: joi.string().required().min(1).max(50),
  theme: joi.string().required().min(1).max(100),
  style: joi.string().valid('watercolor', 'cartoon', 'realistic', 'fantasy').default('watercolor'),
  childId: joi.string().optional(),
  audioModel: joi.string().valid('tts-1', 'tts-1-hd').default('tts-1'),
  audioFormat: joi.string().valid('mp3', 'opus', 'aac', 'flac', 'wav').default('mp3'),
  voice: joi.string().valid('alloy', 'echo', 'fable', 'nova', 'onyx', 'shimmer').default('nova'),
});

const validateStoryInput = (req, res, next) => {
  const { error, value } = storyGenerationSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: error.details.map(detail => detail.message)
    });
  }
  
  req.validatedData = value;
  next();
};

module.exports = { 
  validateStoryInput
};

