const parentalControls = require("../models/ParentalControlsModel");

const getSettings = async (req, res) => {
 
  const userId = req.user._id;
   
  try {
    const settings = await parentalControls.findOne({ userId });
    
    response = {
      ttsConfig: {
        voice: settings.ttsConfig.voice,
        model: settings.ttsConfig.model
      },
      imageConfig: {
        model: settings.imageConfig.model
      },
      storyConfig: {
        wordCount: settings.storyConfig.wordCount,
        allowedThemes: settings.storyConfig.allowedThemes,
        blockedTopics: settings.storyConfig.blockedTopics
      }
    }
    res.json({response});
    
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch settings" });
  }
};

const updateSettings = async (req, res) => {
  const userId = req.user._id;
  const { settings } = req.body;
  console.log("settings: ", settings);
  try {
    await parentalControls.findOneAndUpdate({ userId }, settings, {
      upsert: true,
    });
    res.json({ message: "Settings updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update settings" });
  }
};

const getSettingEnums = async (req, res) => {
  try {

    const schema = parentalControls.schema;
    const settingEnums = {
      ttsConfig: {
        voices: schema.path('ttsConfig.voice').enumValues,
        models: schema.path('ttsConfig.model').enumValues
      },
      imageConfig: {
        models: schema.path('imageConfig.model').enumValues
      },
      storyConfig: {
        allowedThemes: schema.path('storyConfig.allowedThemes').caster.enumValues,
        blockedTopics: schema.path('storyConfig.blockedTopics').caster.enumValues
      }
    };

    res.json(settingEnums);
  } catch (err) {
    console.error('Error fetching setting enums:', err);
    res.status(500).json({ error: 'Failed to fetch setting enums' });
  }
};

module.exports = {
  getSettings,
  getSettingEnums,
  updateSettings,
};
