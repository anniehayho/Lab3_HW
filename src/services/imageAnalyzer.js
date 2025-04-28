import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';

let model = null;

const loadModel = async () => {
  if (model) return model;
  
  await tf.ready();
  model = await cocoSsd.load();
  return model;
};

export const analyzeImage = async (imageUrl) => {
  try {
    // Check if we have cached results
    const cachedResult = await getCachedAnalysis(imageUrl);
    if (cachedResult) {
      return cachedResult;
    }
    
    // Load the model if not loaded
    const detector = await loadModel();
    
    // Process the image using Expo's ImageManipulator
    const manipResult = await ImageManipulator.manipulateAsync(
      imageUrl,
      [{ resize: { width: 300 } }],
      { format: 'jpeg' }
    );
    
    // Get image dimensions
    const getImageSize = () => {
      return new Promise((resolve, reject) => {
        Image.getSize(manipResult.uri, 
          (width, height) => resolve({ width, height }),
          (error) => reject(error)
        );
      });
    };
    
    const { width, height } = await getImageSize();
    
    // Convert image to tensor
    const imgB64 = await RNFS.readFile(manipResult.uri.replace('file://', ''), 'base64');
    const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;
    const raw = new Uint8Array(imgBuffer);
    const imageTensor = tf.image.decodeJpeg(raw);
    
    // Detect objects
    const predictions = await detector.detect(imageTensor);
    
    // Extract the labels (first 3)
    const labels = predictions
      .slice(0, 3)
      .map(prediction => prediction.class);
    
    // Cleanup
    imageTensor.dispose();
    
    // Cache the analysis results
    await cacheAnalysisResult(imageUrl, labels);
    
    return labels;
  } catch (error) {
    console.error('Error analyzing image:', error);
    return [];
  }
};

const cacheKey = (imageUrl) => `image_analysis_${imageUrl}`;

const cacheAnalysisResult = async (imageUrl, labels) => {
  try {
    await AsyncStorage.setItem(cacheKey(imageUrl), JSON.stringify(labels));
  } catch (error) {
    console.error('Error caching analysis:', error);
  }
};

const getCachedAnalysis = async (imageUrl) => {
  try {
    const cached = await AsyncStorage.getItem(cacheKey(imageUrl));
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error('Error getting cached analysis:', error);
    return null;
  }
};