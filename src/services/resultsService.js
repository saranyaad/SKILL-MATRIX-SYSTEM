const API_URL = 'http://localhost:5000/api/results';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

// Save quiz result
export const saveResult = async (resultData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(resultData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

// Get all user results
export const getUserResults = async () => {
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: error.message,
      results: [],
    };
  }
};

// Get results for a specific course
export const getCourseResults = async (courseId) => {
  try {
    const response = await fetch(`${API_URL}/course/${courseId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: error.message,
      results: [],
    };
  }
};

// Get a specific result by ID
export const getResult = async (resultId) => {
  try {
    const response = await fetch(`${API_URL}/${resultId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};
