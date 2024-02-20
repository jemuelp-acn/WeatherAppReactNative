import React, { useContext } from 'react';
import { FlatList, Text, View, Image, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { sharedStyles } from '../utils/SharedStylesComponent';
import forecastViewModel from '../viewmodel/ForecastViewModel';
import locationViewModel from '../viewmodel/LocationViewModel';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import * as Location from 'expo-location';
import { ThemeContext } from './../utils/ThemeProvider';
import { LinearGradient } from 'expo-linear-gradient';

export default function Main() {

    const nav = useNavigation()
    const route = useRoute();
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [currentlocation, setCurrentlocation] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [imageSource, setImageSource] = useState(require('..//../assets/notaddedfavorite.png'));
    const [selectedCity, setSelectedCity] = useState(route.params?.dataFromScreenB !== null ? route.params?.dataFromScreenB : 'Manila');
    const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);

    useEffect(() => {
        console.log("CALLBsACK USE EFFECT", route.params?.dataFromScreenB)
        requestLocationPermission()
    }, []);

    const handleImagePress = () => {
        nav.navigate('LocationManagerScreen', {
            onCallback: handleCallbackFromLocationChange,
        });
    };

    const handleCallbackFromLocationChange = (message) => {
        fetchForecastDetails(message)
    };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const handleRemove = () => {
        removeFavoriteFromObjectArray(userData)
    };

    const requestLocationPermission = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Location permission not granted');
                return;
            }

            const subscription = Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 5000,
                    distanceInterval: 10,
                },

                (location) => {
                    const { latitude, longitude } = location.coords;
                    console.log('New Location:', latitude, longitude);
                    updateDataBasedOnLocation(location);
                }
            );

            return () => {
                subscription.remove();
            };

        } catch (error) {
            console.error('Error requesting location permission:', error);
        }
    };

    const updateDataBasedOnLocation = (location) => {
        // let currentLocation = Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest, });
        setCurrentlocation(location)
        console.log(location.coords.latitude);
        getCityByCoordinates(location)
    };


    async function getCityByCoordinates(location) {
        try {
            const cityselected = await locationViewModel.getCurrentLocationByCity(location.coords.latitude, location.coords.longitude)
            console.log(cityselected.address.city);
            setSelectedCity(cityselected.address.city)
            console.log(`CITIES:, ${cityselected.address.city} : ${selectedCity}`)
            fetchForecastDetails(cityselected.address.city)

        } catch (error) {
            console.error('getCityByCoordinates - Error fetching user city data:', error);
        }
    }

    async function fetchForecastDetails(cityselected) {
        try {
            setIsLoading(true);
            const data = await forecastViewModel.getForecastByCity(cityselected)
            setUserData(data);
            checkIfAlreadyAddedFavorites(data)

        } catch (error) {
            console.error('fetchForecastDetails - Error fetching user data:', error);
        }
    }

    const saveFavorites = async () => {
        try {
            const favoritesData = await AsyncStorage.getItem('myfavorites');
            if (favoritesData != null) {
                if (isAlreadyAddedFavorite(JSON.parse(favoritesData), userData)) {
                    toggleModal()
                    return;
                }
            }
            const parsedExistingFavorites = favoritesData ? JSON.parse(favoritesData) : [];
            const updatedFavorites = [...parsedExistingFavorites, userData];
            await AsyncStorage.setItem('myfavorites', JSON.stringify(updatedFavorites));
            setImageSource(require('..//../assets/addedfavorite.png'));

        } catch (error) {
            console.error('Error saving data to AsyncStorage:', error);
        }
    };

    const removeFavoriteFromObjectArray = async (itemToRemove) => {
        try {
            const existingFavorites = await AsyncStorage.getItem('myfavorites');
            const parsedExistingFavorites = existingFavorites ? JSON.parse(existingFavorites) : [];
            const indexToRemove = parsedExistingFavorites.findIndex(
                (favorite) => favorite.cityName === itemToRemove.cityName
            );
            if (indexToRemove !== -1) {
                console.log(indexToRemove)
                parsedExistingFavorites.splice(indexToRemove, 1);
                await AsyncStorage.setItem('myfavorites', JSON.stringify(parsedExistingFavorites));
            } else {
                console.log('Item not found in the array.');
            }
            checkIfAlreadyAddedFavorites(userData)
            toggleModal();
        } catch (error) {
            console.error('Error removing favorite from AsyncStorage:', error);
        }
    };

    const checkIfAlreadyAddedFavorites = async (data) => {
        try {
            const favoritesData = await AsyncStorage.getItem('myfavorites');
            if (favoritesData != null) {
                if (isAlreadyAddedFavorite(JSON.parse(favoritesData), data)) {
                    console.log('ADDED FAVORITES')
                    setImageSource(require('..//../assets/addedfavorite.png'));
                } else {
                    console.log('NOT ADDED FAVORITES')
                    setImageSource(require('..//../assets/notaddedfavorite.png'));
                }
            }
            setIsLoading(false);
        } catch (error) {
            console.error('Error loading favorites from AsyncStorage:', error);
        }
    };

    function isAlreadyAddedFavorite(favoritesData, data) {
        let isAlreadyAdded = false;
        console.log(favoritesData)
        for (const item of favoritesData) {
            if (item.cityName === data.cityName) {
                isAlreadyAdded = true;
                break;
            }
        }
        return isAlreadyAdded
    }

    const renderItem = ({ item }) => (
        <View>
            <Text style={[sharedStyles.listItemDayText, { color: isDarkMode ? 'white' : 'black' }]}>{item.date}</Text>
            <Image source={{ uri: item.icon }} style={sharedStyles.image}></Image>
            <Text style={[sharedStyles.listItemDegreeText, { color: isDarkMode ? 'white' : 'black' }]}>{item.temp}°</Text>
        </View>
    );

    return (
        <View style={[sharedStyles.mainContainer]}>
            <LinearGradient colors={userData ? getGradient(userData.DailyForecastItem[0].condition) : ['#BBBCBE', '#BBBCBE']} style={sharedStyles.mainContainer}>
                <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
                    <View style={sharedStyles.modalContainer}>
                        <Text style={sharedStyles.modalText}>Are you sure you want to remove favorite?</Text>

                        <View style={sharedStyles.modalButtonsContainer}>
                            <TouchableOpacity onPress={handleRemove}>
                                <Text style={sharedStyles.modalButton}>Yes</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={toggleModal}>
                                <Text style={sharedStyles.modalButton}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                {userData ? (
                    <View style={sharedStyles.mainContainer}>
                        <View>
                            <View style={[sharedStyles.cardContainer, { justifyContent: 'space-between' }, { marginTop: '10%' }]}>
                                <Switch
                                    style={[{ marginStart: '2%' }]}
                                    value={isDarkMode}
                                    onValueChange={toggleDarkMode}
                                    trackColor={{ false: 'gray', true: 'blue' }}
                                    thumbColor={isDarkMode ? 'white' : 'blue'}
                                />
                                <TouchableOpacity onPress={handleImagePress} style={[{ margin: '5%' }]}>
                                    <Image source={require('..//../assets/menu.png')} style={[sharedStyles.settingsImage, { tintColor: isDarkMode ? 'white' : 'black' }]}></Image>
                                </TouchableOpacity>
                            </View>
                            {isLoading ? (
                                <ActivityIndicator size="large" color="blue" style={[]} />
                            ) : (
                                <View style={[{ flexDirection: 'column', alignItems: 'center' }]}>
                                    <Text style={[sharedStyles.mediumText, { color: isDarkMode ? 'white' : 'black' }]}>{userData.cityName}</Text>
                                    <Image source={{ uri: userData.DailyForecastItem[0].icon }} style={[sharedStyles.mainImage]}></Image>
                                    <Text style={[sharedStyles.largeText, { color: isDarkMode ? 'white' : 'black' }]}>{userData.DailyForecastItem[0].temp}°</Text>
                                    <Text style={[sharedStyles.mediumText, { color: isDarkMode ? 'white' : 'black' }]}>{userData.DailyForecastItem[0].condition}</Text>
                                </View>
                            )}
                            <View style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                                <View style={[{ flexDirection: 'column', margin: '4%' }]}>
                                    <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                                        <Image source={require('..//../assets/wind.png')} style={[sharedStyles.settingsImage, { marginBottom: '5%' }, { flexDirection: 'row' }, { tintColor: isDarkMode ? 'white' : 'black' }]}></Image>
                                        <Text style={[sharedStyles.smallText, { marginLeft: '5%' }, { color: isDarkMode ? 'white' : 'black' }]}>{userData.DailyForecastItem[0].wind} mph</Text>
                                    </View>
                                    <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                                        <Image source={require('..//../assets/humidity.png')} style={[sharedStyles.settingsImage, { marginBottom: '5%' }, { flexDirection: 'row' }, { tintColor: isDarkMode ? 'white' : 'black' }]}></Image>
                                        <Text style={[sharedStyles.smallText, { marginLeft: '5%' }, { color: isDarkMode ? 'white' : 'black' }]}>{userData.DailyForecastItem[0].humidity}%</Text>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={saveFavorites} style={[{ alignItems: 'flex-end' }, { margin: '5%' }]}>
                                    <Image source={imageSource} style={[sharedStyles.favImage, { marginBottom: '5%' }, { flexDirection: 'row' },]}></Image>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={[sharedStyles.card, { backgroundColor: isDarkMode ? 'black' : 'white' }]}>
                            <View style={sharedStyles.cardContainer}>
                                <Text style={[sharedStyles.smallText, { margin: '5%' }, { color: isDarkMode ? 'white' : 'black' }]}>Today</Text>
                                <Text style={[sharedStyles.smallText, { flex: 1 }, { margin: '5%' }, { textAlign: 'right' }, { color: isDarkMode ? 'white' : 'black' }]}>{forecastViewModel.getCurrentDate()}</Text>
                            </View>
                            {<FlatList
                                data={userData.DailyForecastItem}
                                horizontal={true}
                                overScrollMode="never"
                                renderItem={renderItem}
                                keyExtractor={(i) => i.date}
                                ItemSeparatorComponent={() => {
                                    return (
                                        <View
                                            style={{
                                                height: "100%",
                                                backgroundColor: "#808080",
                                                margin: 2
                                            }}
                                        />
                                    );
                                }}
                            />}
                        </View>
                    </View>

                ) : (
                    <View style={sharedStyles.mainContainer}>
                        <Text style={{ color: 'white' }}>No Forecast</Text>
                    </View>
                )
                }
            </LinearGradient>

        </View>
    )
}

const getGradient = (condition) => {
    switch (condition) {
        case 'Sunny':
            return ['#8C9BA7', '#D8A059'];
        case 'Partly Cloudy':
            return ['#99A7C3', '#C8AF99'];
        case 'Cloudy':
            return ['#96A3B3', '#B59996'];
        case 'Overcast':
            return ['#878D96', '#7A6A74'];
        case 'Mist':
            return ['#657586', '#A39E7E'];
        case 'Patchy rain nearby':
            return ['#58606B', '#858E97'];
        case 'Thundery outbreaks in nearby':
            return ['#757D88', '#C2B69E'];
        default:
            return ['#BBBCBE', '#BBBCBE'];
    }
};



