const BASE_URL = 'https://nominatim.openstreetmap.org';

class LocationAPI {

  getCurrentCityLocation = async (lat, long) => {
    try {
      const response = await fetch(`${BASE_URL}/reverse?lat=${lat}&lon=${long}&format=json`,);
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };
}

const locationAPI = new LocationAPI();
export default locationAPI;