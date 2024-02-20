import React, { useContext } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { sharedStyles } from '../utils/SharedStylesComponent';
import forecastViewModel from '../viewmodel/ForecastViewModel';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from './../utils/ThemeProvider';

export default function LocationManager() {
    const nav = useNavigation();
    const route = useRoute();
    const [inputText, setInputText] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [favorites, setSuggestions2] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
    const placeholderColor = isDarkMode ? 'white' : 'black';

    function handleInputChange(text) {
        setInputText(text);
    }

    const onCallbackFromMain = route.params?.onCallback || ((item) => { });

    useEffect(() => {
        if (inputText.length !== 0) {
            const timer = setTimeout(() => {
                console.log(`Final text value: ${inputText}`);
                getsearchCities(inputText)
            }, 500);
            return () => clearTimeout(timer);
        }
        getFavoritesList()
    }, [inputText]);

    const getFavoritesList = async () => {
        const favoritesData = await AsyncStorage.getItem('myfavorites');
        setSuggestions2(JSON.parse(favoritesData))
        setIsLoading(false);
    }

    async function getsearchCities(text) {
        setIsLoading(true);
        const results = await new Promise(resolve => {
            setTimeout(() => {
                const data = forecastViewModel.searchCities(text);
                resolve(data);
            }, 5000);
        });
        setSuggestions(results);
        setIsLoading(false);
    }

    const handleItemClick = (item) => {
        console.log(`Item clicked: ${item}`);
        onCallbackFromMain(item)
        nav.goBack()
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleItemClick(item.name)}>
            <View style={sharedStyles.locationListItem}>
                <Text style={{ color: isDarkMode ? 'white' : 'black' }}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderItem2 = ({ item }) => (
        <TouchableOpacity onPress={() => handleItemClick(item.cityName)}>
            <View style={sharedStyles.locationListItem}>
                <Text style={{ color: isDarkMode ? 'white' : 'black' }}>{item.cityName}</Text>
            </View>
        </TouchableOpacity>
    );
    return (
        <View style={[sharedStyles.locationManagerContainer, { backgroundColor: isDarkMode ? 'black' : 'white' }]}>
            <View>
                <Text style={[sharedStyles.mediumText, { color: isDarkMode ? 'white' : 'black' }, { marginBottom: '5%' }]}>My Favorites Places</Text>
            </View>
            {isLoading ? (
                <ActivityIndicator size="large" color="blue" style={[]} />
            ) : (
                <TextInput
                style={[sharedStyles.inputText, { color: isDarkMode ? 'white' : 'black' }]}
                placeholder="Search Location..."
                placeholderTextColor={placeholderColor}
                value={inputText}
                onChangeText={handleInputChange}
            />
            )}
            {(() => {
                if (inputText.length != 0) {
                    if (suggestions != null) {
                        return <FlatList
                            data={suggestions}
                            renderItem={renderItem}
                            // keyExtractor={(key) => key}
                            style={sharedStyles.locationList}
                        />
                    }
                } else {
                    return <FlatList
                        data={favorites}
                        renderItem={renderItem2}
                        // keyExtractor={(id) => id}
                        style={sharedStyles.locationList}
                    />

                }
            })()}
        </View>
    );
}
