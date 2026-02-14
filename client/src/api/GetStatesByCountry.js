const API_KEY = import.meta.env.VITE_CITY_API;
const BASE_URL = 'https://api.countrystatecity.in/v1';


export const getCitiesByState = async (countryCode, stateCode) => {
  try {
    console.log(`Fetching cities for ${countryCode}/${stateCode}...`);
    console.log(import.meta.env.VITE_API_KEY);
    const response = await fetch(
      `${BASE_URL}/countries/${countryCode}/states/${stateCode}/cities`, 
      {
        method: 'GET',
        headers: { 
          'X-CSCAPI-KEY': API_KEY
        }
      }
    );
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const cities = await response.json();
      console.log(`✓ Found ${cities.length} cities`);
      return cities;
    } else {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, errorText);
      
      // If 401, the API key might be invalid or expired
      if (response.status === 401) {
        console.error('API key is invalid or expired. Please check your API key at https://countrystatecity.in/');
      }
      
      return [];
    }
  } catch (error) {
    console.error('❌ Error fetching cities:', error);
    return [];
  }
};

export const getStatesByCountry = async (countryCode) => {
  try {
    const response = await fetch(
      `${BASE_URL}/countries/${countryCode}/states`,
      {
        method: 'GET',
        headers: {
          'X-CSCAPI-KEY': API_KEY
        }
      }
    );
    
    if (response.ok) {
      const states = await response.json();
      console.log(`✓ Found ${states.length} states`);
      return states;
    } else {
      console.error('❌ Country not found or no states available');
      return [];
    }
  } catch (error) {
    console.error('❌ Error fetching states:', error);
    return [];
  }
};

// Test function to verify API key
export const testApiKey = async () => {
  try {
    const response = await fetch(`${BASE_URL}/countries`, {
      headers: { 'X-CSCAPI-KEY': API_KEY }
    });
    
    if (response.ok) {
      console.log('✓ API Key is valid!');
      return true;
    } else {
      console.error('❌ API Key is invalid!');
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing API key:', error);
    return false;
  }
};