// Frontend Configuration
// This file contains all configuration settings for the frontend

const CONFIG = {
    // API Base URL - Update this after deploying to Render
    API_BASE_URL: getApiUrl(),
    
    // App Settings
    APP_NAME: 'Lost & Found System',
    COLLEGE_NAME: 'Jyothi Engineering College',
    
    // Pagination
    ITEMS_PER_PAGE: 10,
    
    // Session
    SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
};

// Automatically detect the correct API URL
function getApiUrl() {
    // Check if we're on Render.com
    const hostname = window.location.hostname;
    
   // Automatically detect the correct API URL
function getApiUrl() {
    const hostname = window.location.hostname;

    // Production (Render frontend)
  if (hostname.includes('onrender.com')) {
    return 'https://lost-and-found-1-1zfg.onrender.com/api';
}

    // Local development
    return 'https://lost-and-found-1-1zfg.onrender.com/api';
}

// Export for use in HTML files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
