import locationAPI from '../network/LocationAPI.js'

const getCurrentLocationByCity = async (lat, long) => {

    try {
        const data = await locationAPI.getCurrentCityLocation(lat, long);
        return data
    } catch (error) {
        console.error('LocationViewModel getCurrentLocationByCity - Error fetching user data:', error);
    }
}

export default {getCurrentLocationByCity};