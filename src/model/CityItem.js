class CityItem {
  constructor( lat, lon, name) {
    this.id = generateRandomKey() + 2
    this.key = generateRandomKey() + 1
    this.lat = lat;s
    this.lon = lon;
    this.name = name;
  }
}

const generateRandomKey = () => {
  return Math.random().toString(36).substring(2, 10);
};
export default CityItem;
