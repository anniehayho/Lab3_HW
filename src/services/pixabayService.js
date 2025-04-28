import axios from 'axios';

const API_KEY = '49979375-f07c8ad1079db1f51efd4c008';
const BASE_URL = 'https://pixabay.com/api/';

export const fetchImages = async (page = 1, perPage = 20, query = '') => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query || 'nature',
        page,
        per_page: perPage,
        image_type: 'photo',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
};