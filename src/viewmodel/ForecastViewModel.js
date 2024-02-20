import CityItem from '../model/CityItem.js';
import DailyForecastItem from '../model/DailyForecastItem.js';
import WeatherItem from '../model/WeatherItem.js';
import forecastAPI from '../network/WeatherAPI.js'

const getForecastByCity = async (city) => {
    try {
        // console.log('ForecastViewModel - City: ', city)
        const data = await forecastAPI.fetchForecastDetails(city);
        // console.log('ForecastViewModel - Location: ', data.location)
        const cityItem = new CityItem(data.location.lat, data.location.lon, data.location.name)
        const dailyForecast = data.forecast.forecastday.map((item) => {
            // console.log('ForecastViewModel - DATE 1:', item.date)
            // console.log('ForecastViewModel - DATE 2: ', convertDateToDay(item.date))
            return new DailyForecastItem(
                item.day.condition.text,
                item.day.maxtemp_c,
                convertDateToDay(item.date),
                item.day.maxwind_kph,
                item.day.avghumidity,
                'https:' + item.day.condition.icon)
        })
        return weather = new WeatherItem(data.location.name, dailyForecast, cityItem)
    } catch (error) {
        console.error('ForecastViewmodel getForecastByCity - Error fetching user data:', error);
    }
}

const searchCities = async (searchKey) => {
    try {
        const data = await forecastAPI.locationDetails(searchKey);
        const listCity =  data.map((cityListItem) => {
            return new CityItem(cityListItem.lat, cityListItem.lon, `${cityListItem.name}, ${cityListItem.country}`)
        })
        console.log(listCity);
        return listCity
    } catch (error) {
        console.error('ForecastViewmodel searchCities- Error fetching user data:', error);
    }
}

const convertDateToDay = (dateString) => {
    // console.log(`convertDateToDay`, dateString);
    const dateObject = new Date(dateString);
    const dayOfWeek = dateObject.toLocaleDateString('en-US', {
        weekday: 'long', month: 'numeric', day: 'numeric', year: 'numeric',
    });
    const [dayName, datePart] = dayOfWeek.split(', ');
    return dayName
}

const getCurrentDate = () => {
    const formattedDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    return formattedDate
}

export default { getForecastByCity, getCurrentDate, searchCities };