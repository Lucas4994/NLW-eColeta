import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import Constants from 'expo-constants';

import GOOGLE_MAPS_APIKEY from '../../../googleKey/key';

interface Params {
    latitude: number,
    longitude: number

}
const HowToGet = () => {
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
    const route = useRoute();

    const routeParams = route.params as Params;

    useEffect(() => {
        async function loadPosition() {
            const { status } = await Location.requestPermissionsAsync();
            if (status !== "granted") {
                Alert.alert('Ooops...', 'Precisamos da sua posição para obter a localização');
                return;
            }

            const location = await Location.getCurrentPositionAsync();

            const { latitude, longitude } = location.coords;

            setInitialPosition([latitude, longitude]);
        }
        loadPosition();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.mapContainer}>
                {initialPosition[0] !== 0 && (
                <MapView
                    loadingEnabled={initialPosition[0] === 0}
                    style={styles.map}
                    initialRegion={{
                        latitude: initialPosition[0],
                        longitude: initialPosition[1],
                        latitudeDelta: 0.014,
                        longitudeDelta: 0.014
                    }}>
                    <Marker coordinate={{latitude: initialPosition[0], longitude: initialPosition[1]}}/>
                    <Marker coordinate={{latitude: routeParams.latitude, longitude: routeParams.longitude}}/>
                    <MapViewDirections
                        origin={{
                            latitude: initialPosition[0],
                            longitude: initialPosition[1],
                        }}
                        destination={{
                            latitude: routeParams.latitude,
                            longitude: routeParams.longitude
                        }}
                        apikey={GOOGLE_MAPS_APIKEY.GOOGLE_MAPS_APIKEY}
                        strokeWidth={3}
                        strokeColor="hotpink"
                    />
                </MapView>)}
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 32,
        paddingTop: 20 + Constants.statusBarHeight,
    },

    mapContainer: {
        flex: 1,
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 16,
    },

    map: {
        width: '100%',
        height: '100%',
    },

    mapMarker: {
        width: 90,
        height: 80,
    },

    mapMarkerContainer: {
        width: 90,
        height: 70,
        backgroundColor: '#34CB79',
        flexDirection: 'column',
        borderRadius: 8,
        overflow: 'hidden',
        alignItems: 'center'
    },

    mapMarkerTitle: {
        flex: 1,
        fontFamily: 'Roboto_400Regular',
        color: '#FFF',
        fontSize: 13,
        lineHeight: 23,
    },

});

export default HowToGet;