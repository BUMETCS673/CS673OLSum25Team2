// config/firebase.js
const { initializeApp } = require('firebase/app');
const { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, listAll, getMetadata } = require('firebase/storage');
const axios = require('axios');
// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

/**
 * Save audio file to Firebase Storage
 * @param {Buffer} audioBuffer - The audio file buffer from OpenAI
 * @param {string} storyId - The story ID
 * @param {Object} options - Upload options
 * @returns {Promise<string>} - The public download URL
 */
const saveAudioFile = async (audioBuffer, storyId, options = {}) => {
  try {
    const {
      audioFormat = 'mp3',
      voice = 'nova',
      model = 'tts-1'
    } = options;

    // Generate unique filename
    const filename = `audio/${storyId}.${audioFormat}`;
    
    console.log(`Uploading audio file: ${filename}`);
    
    // Create storage reference
    const storageRef = ref(storage, filename);
    
    // Get content type
    const contentType = getAudioContentType(audioFormat);
    
    // Create metadata
    const metadata = {
      contentType: contentType,
      cacheControl: 'public, max-age=31536000', // 1 year cache
      customMetadata: {
        storyId: storyId,
        voice: voice,
        model: model,
        audioFormat: audioFormat,
        uploadedAt: new Date().toISOString(),
        fileType: 'audio',
        fileSize: audioBuffer.length.toString()
      }
    };
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, audioBuffer, metadata);
    
    console.log(`Audio file uploaded successfully: ${filename}`);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
    
  } catch (error) {
    console.error('Error uploading audio to Firebase Storage:', error);
    throw new Error(`Audio upload failed: ${error.message}`);
  }
};

/**
 * Save image file to Firebase Storage (from URL)
 * @param {string} imageUrl - The source image URL (from OpenAI DALL-E)
 * @param {string} storyId - The story ID for organization
 * @param {Object} options - Upload options
 * @returns {Promise<string>} - The public download URL
 */
const saveImageFile = async (imageUrl, storyId, options = {}) => {
  try {
    const {
      imageFormat = 'png',
      quality = 'standard'
    } = options;

    console.log(`Downloading image from: ${imageUrl}`);

    // Download the image from OpenAI using axios
    const response = await axios({
      method: 'GET',
      url: imageUrl,
      responseType: 'arraybuffer',
      timeout: 30000
    });
    
    if (response.status !== 200) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    
    const imageBuffer = Buffer.from(response.data);
    
    console.log(`Downloaded image buffer size: ${imageBuffer.length} bytes`);
    
    // Validate buffer
    if (imageBuffer.length === 0) {
      throw new Error('Downloaded image buffer is empty');
    }
    
    // Generate unique filename
    const filename = `images/${storyId}.${imageFormat}`;
    
    console.log(`Uploading image file: ${filename}`);
    
    // Create storage reference
    const storageRef = ref(storage, filename);
    
    // Get content type
    const contentType = getImageContentType(imageFormat);
    
    // Create metadata
    const metadata = {
      contentType: contentType,
      cacheControl: 'public, max-age=31536000', // 1 year cache
      customMetadata: {
        storyId: storyId,
        imageFormat: imageFormat,
        quality: quality,
        sourceUrl: imageUrl,
        uploadedAt: new Date().toISOString(),
        fileType: 'image',
        fileSize: imageBuffer.length.toString()
      }
    };
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, imageBuffer, metadata);
    
    console.log(`Image file uploaded successfully: ${filename}`);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log(`Image download URL: ${downloadURL}`);
    
    return downloadURL;
    
  } catch (error) {
    console.error('Error uploading image to Firebase Storage:', error);
    
    // Provide more specific error messages
    if (error.code === 'ECONNABORTED') {
      throw new Error('Image download timeout - server took too long to respond');
    } else if (error.response) {
      throw new Error(`Image download failed: HTTP ${error.response.status} - ${error.response.statusText}`);
    } else if (error.request) {
      throw new Error('Image download failed: No response from server');
    } else {
      throw new Error(`Image upload failed: ${error.message}`);
    }
  }
};


/**
 * List all files for a specific story
 * @param {string} storyId - The story ID
 * @returns {Promise<Object>} - Object containing audio and image file URLs
 */
const listStoryFiles = async (storyId) => {
  try {
    const audioRef = ref(storage, `audio/${storyId}/`);
    const imageRef = ref(storage, `images/${storyId}/`);
    
    // List audio files
    const audioResult = await listAll(audioRef);
    const audioFiles = await Promise.all(
      audioResult.items.map(async (item) => {
        const url = await getDownloadURL(item);
        return {
          name: item.name,
          url: url,
          type: 'audio',
          path: item.fullPath
        };
      })
    );
    
    // List image files
    const imageResult = await listAll(imageRef);
    const imageFiles = await Promise.all(
      imageResult.items.map(async (item) => {
        const url = await getDownloadURL(item);
        return {
          name: item.name,
          url: url,
          type: 'image',
          path: item.fullPath
        };
      })
    );
    
    return {
      audioFiles,
      imageFiles,
      totalFiles: audioFiles.length + imageFiles.length
    };
    
  } catch (error) {
    console.error('Error listing story files:', error);
    throw error;
  }
};

/**
 * Helper functions for content types
 */
const getAudioContentType = (format) => {
  const contentTypes = {
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    opus: 'audio/opus',
    aac: 'audio/aac',
    flac: 'audio/flac',
    ogg: 'audio/ogg'
  };
  return contentTypes[format.toLowerCase()] || 'audio/mpeg';
};

const getImageContentType = (format) => {
  const contentTypes = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml'
  };
  return contentTypes[format.toLowerCase()] || 'image/png';
};

/**
 * Utility function to convert file size to human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Human readable file size
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

      
module.exports = {
  saveAudioFile,
  saveImageFile,
  listStoryFiles,
  formatFileSize,
  storage,
  app
};