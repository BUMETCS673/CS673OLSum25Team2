const Story = require('../models/StoryModel');
const GenerationRequest = require('../models/GenerationRequestModel');
const { generateStoryWithOpenAI, generateImageWithOpenAI } = require('../services/openaiService');

const generateCompleteStory = async (req, res) => {
  const startTime = Date.now();
  let generationRequest;
  console.log(req.validatedData);
  try {
    const { character, setting, theme, ageGroup = '3-5', style = 'watercolor', childId } = req.validatedData;
    const userId = req.parentId; 
    
    console.log('Generating complete story package for:', { character, setting, theme, ageGroup });
    
    // Create generation request record
    generationRequest = new GenerationRequest({
      userId,
      parameters: { character, setting, theme, ageGroup, style },
      timing: { startTime: new Date(startTime) },
      status: 'processing'
    });
    await generationRequest.save();
    
    // Generate story and image in parallel
    const [storyResult, imageResult] = await Promise.allSettled([
      generateStoryWithOpenAI({ character, setting, theme, ageGroup }),
      generateImageWithOpenAI({ character, setting, theme, style })
    ]);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Prepare response object
    const response = {
      success: true,
      generatedAt: new Date().toISOString(),
      generationTime: duration,
      metadata: { character, setting, theme, ageGroup, style }
    };
    
    // Process story result
    let storyContent = null;
    let wordCount = 0;
    
    if (storyResult.status === 'fulfilled') {
      storyContent = storyResult.value;
      wordCount = storyContent.split(' ').length;
      response.story = storyContent;
      response.wordCount = wordCount;
      
      // Update generation request
      generationRequest.results.storyGenerated = true;
    } else {
      response.storyError = 'Failed to generate story';
      generationRequest.results.storyError = storyResult.reason?.message || 'Unknown error';
      console.error('Story generation failed:', storyResult.reason);
    }
    
    // Process image result
    let imageUrl = null;
    let revisedPrompt = null;
    
    if (imageResult.status === 'fulfilled') {
      imageUrl = imageResult.value.imageUrl;
      revisedPrompt = imageResult.value.revisedPrompt;
      response.imageUrl = imageUrl;
      response.revisedPrompt = revisedPrompt;
      
      // Update generation request
      generationRequest.results.imageGenerated = true;
    } else {
      response.imageError = 'Failed to generate image';
      generationRequest.results.imageError = imageResult.reason?.message || 'Unknown error';
      console.error('Image generation failed:', imageResult.reason);
    }
    
    // Save story to database if at least story was generated
    let savedStory = null;
    if (storyContent) {
      const storyTitle = `${character}'s ${theme} Adventure`;
      
      savedStory = new Story({
        userId,
        childId: childId || null,
        title: storyTitle,
        content: storyContent,
        character,
        setting,
        theme,
        ageGroup,
        wordCount,
        imageUrl,
        imageStyle: style,
        revisedPrompt,
        isComplete: !!(storyContent && imageUrl),
        generationTime: duration,
        generatedAt: new Date()
      });
      
      await savedStory.save();
      response.storyId = savedStory._id;
      response.storySlug = savedStory.storyId;
    }
    
    // Update generation request with final status
    generationRequest.timing.endTime = new Date(endTime);
    generationRequest.timing.duration = duration;
    generationRequest.status = storyContent ? 'completed' : 'failed';
    await generationRequest.save();
    
    res.json(response);
    
  } catch (error) {
    console.error('Error generating complete package:', error);
    
    // Update generation request with error
    if (generationRequest) {
      generationRequest.status = 'failed';
      generationRequest.timing.endTime = new Date();
      generationRequest.timing.duration = Date.now() - startTime;
      await generationRequest.save();
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to generate complete story package',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get user's stories
const getUserStories = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, childId } = req.query;
    
    const query = { userId };
    if (childId) query.childId = childId;
    
    const stories = await Story.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('childId', 'name age');
    
    const total = await Story.countDocuments(query);
    
    res.json({
      success: true,
      stories,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stories'
    });
  }
};

// Get specific story
const getStory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const story = await Story.findOne({ _id: id, userId })
      .populate('childId', 'name age');
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }
    
    res.json({
      success: true,
      story
    });
  } catch (error) {
    console.error('Error fetching story:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch story'
    });
  }
};

// Save story to favorites
const saveStory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const story = await Story.findOneAndUpdate(
      { _id: id, userId },
      { isSaved: true },
      { new: true }
    );
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Story saved to favorites',
      story
    });
  } catch (error) {
    console.error('Error saving story:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save story'
    });
  }
};

// Delete story
const deleteStory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const story = await Story.findOneAndDelete({
      _id: id,
      userId
    });
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Story deleted successfully',
      deletedStory: story
    });
  } catch (error) {
    console.error('Error deleting story:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete story'
    });
  }
};

module.exports = {
  generateCompleteStory,
  getUserStories,
  getStory,
  saveStory,
  deleteStory
};

