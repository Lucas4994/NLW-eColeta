import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import { Feather as Icon } from '@expo/vector-icons';
import { View, StyleSheet, TouchableOpacity, Text, Image, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import { ScrollView } from 'react-native';
import * as Location from 'expo-location';
import api from '../../services/api';

interface Item {
    id: number,
    title: string,
    imageUrl: string
}

interface Point {
    id: number,
    name: string
    image: string,
    latitude: number,
    longitude: number
}

interface Params {
    city: string,
    uf: string
  }

const Points = () => {

    const [items, setItems] = useState<Item[]>();
    const [selecetedItems, setSelectedItems] = useState<number[]>([]);
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
    const [points, setPoints] = useState<Point[]>([]);
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

    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data);
        })
    }, []);

    useEffect(() => {
        api.get('points', {
            params: {
                city: routeParams.city,
                uf: routeParams.uf,
                items: selecetedItems
            }
        }).then(response => {
            setPoints(response.data);
        })
    }, [selecetedItems]);

    const navigation = useNavigation();
    function handleNavigationBack() {
        navigation.goBack();
    }

    function handleNavigateToDetail(pointId: number) {
        navigation.navigate('Details', 
        { 
            point_id: pointId
        })
    }

    function handleSelectetItem(itemId: number) {
        const alredySelected = selecetedItems.findIndex(item => item === itemId);

        if (alredySelected >= 0) {
            const filteredItems = selecetedItems.filter(item => item !== itemId);
            setSelectedItems(filteredItems);
        } else {
            setSelectedItems([...selecetedItems, itemId])
        }

    }

    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleNavigationBack}>
                    <Icon name="arrow-left" size={20} color="#34cb79" />
                </TouchableOpacity>
                <Text style={styles.title}>Bem Vindo</Text>
                <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>

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
                            {points.map(point => {
                                return (<Marker
                                    key={String(point.id)}
                                    style={styles.mapMarker}
                                    onPress={() => { handleNavigateToDetail(point.id) }}
                                    coordinate={{
                                        latitude: point.latitude,
                                        longitude: point.longitude
                                    }}>
                                    <View style={styles.mapMarkerContainer}>
                                        <Image style={styles.mapMarkerImage} source={{ uri: point.image }} />
                                        <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                                    </View>
                                </Marker>)
                            })}

                        </MapView>)}
                </View>
            </View>

            <View style={styles.itemsContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator
                    contentContainerStyle={{ paddingHorizontal: 20 }}>
                    {items?.map(items => (
                        <TouchableOpacity
                            key={String(items.id)}
                            style={[styles.item,
                            selecetedItems?.includes(items.id) ? styles.selectedItem : {}
                            ]}
                            activeOpacity={0.6}
                            onPress={() => { handleSelectetItem(Number(items.id)) }}>
                            <SvgUri width={42} height={42} uri={items.imageUrl} />
                            <Text style={styles.itemTitle}>{items.title}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 32,
        paddingTop: 20 + Constants.statusBarHeight,
    },

    title: {
        fontSize: 20,
        fontFamily: 'Ubuntu_700Bold',
        marginTop: 24,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 4,
        fontFamily: 'Roboto_400Regular',
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

    mapMarkerImage: {
        width: 90,
        height: 45,
        resizeMode: 'cover',
    },

    mapMarkerTitle: {
        flex: 1,
        fontFamily: 'Roboto_400Regular',
        color: '#FFF',
        fontSize: 13,
        lineHeight: 23,
    },

    itemsContainer: {
        flexDirection: 'row',
        marginTop: 16,
        marginBottom: 32,
    },

    item: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#eee',
        height: 120,
        width: 120,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 16,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'space-between',

        textAlign: 'center',
    },

    selectedItem: {
        borderColor: '#34CB79',
        borderWidth: 2,
    },

    itemTitle: {
        fontFamily: 'Roboto_400Regular',
        textAlign: 'center',
        fontSize: 13,
    },
});

export default Points;
