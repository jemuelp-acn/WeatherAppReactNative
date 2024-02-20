import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const sharedStyles = {
  mainContainer: {
    flex: 1,
    flexDirection: 'column'
  },
  largeText: {
    fontSize: 70,
    fontWeight: 'bold',
    textAlign: 'center',
    alignItems: 'center',
  },
  mediumText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 15,
    textAlign: 'center'
  },
  card: {
    backgroundColor: 'white',
    elevation: 20,
    shadowColor: '#222',
    borderColor:'gray',
    shadowOffset: { width: 0, height: 0 },
    flexDirection: 'column',
    margin: '2%'
  },
  cardContainer: {
    flexDirection: 'row',
  },
  image: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2
  },
  mainImage: {
    width: 170,
    height: 170,
    justifyContent: 'center',
    alignItems: 'center'
  },
  settingsImage: {
    width: 20,
    height: 20,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    margin: 2
  },

  favImage: {
    width: 50,
    height: 50,
    flexDirection: 'row', // Align items horizontally
    justifyContent: 'flex-end', // Align items to the end (right)
    alignItems: 'center', // Center items vertically
    margin: 2
    
  },

  listItemDayText: {
    fontSize: 15,
    margin: 10,
    textAlign: 'center'
  },
  listItemDegreeText: {
    fontSize: 25,
    margin: 10
  },
  locationManagerContainer: {
    flex: 1,
    padding: 16,
    marginTop: 40,
  },
  inputText: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
  },
  locationList: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: 'gray',
  },
  locationListItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    color: 'blue',
    fontSize: 16,
  },
};


