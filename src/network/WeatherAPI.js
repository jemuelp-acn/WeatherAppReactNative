const API_KEY = 'c1b13ed01acb492fad464004242501';
const BASE_URL = 'http://api.weatherapi.com/v1';
const NUMBER_OF_DAYS = 5

class WeatherAPI{

 locationDetails = async (searchKey) => {
        try {
          const response = await fetch(
            `${BASE_URL}/search.json?key=${API_KEY}&q=${searchKey}`,
          );
          const data = await response.json();
          console.log('API Response:', data)
          return data;
        } catch (error) {
          throw error;
        }
    };


 fetchForecastDetails = async (city) => {
        try {
            const response = await fetch(
            `${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=${NUMBER_OF_DAYS}`,
            );
            const data = await response.json();
            // console.log('API Response:', data)
            return data;
        } catch (error) {
          console.error('WeatherAPI - Error fetching user data:', error);
        }
        };
}


const forecastViewModel = new WeatherAPI();
export default forecastViewModel;