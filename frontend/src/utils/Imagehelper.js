export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
    
    // Ensure proper slash handling
    const cleanBase = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    
    return `${cleanBase}${cleanPath}`;
  };