const joi = require('joi');

const storyGenerationSchema = joi.object({
  character: joi.string().required().min(1).max(50),
  setting: joi.string().required().min(1).max(50),
  theme: joi.string().required().min(1).max(100),
  ageGroup: joi.string().valid('3-5', '5-8').default('3-5'),
  style: joi.string().valid('watercolor', 'cartoon', 'realistic', 'fantasy').default('watercolor'),
  parentId: joi.string().optional()
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

module.exports = { validateStoryInput };