import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import * as Location from 'expo-location';
import api from '../../services/api';
import styles from './styles';

interface Item {
    id: number,
    name: string,
    imageUrl: string
}

interface Point {
    id: number,
    image: string,
    name: string,
    latitude: number,
    longitude: number,
    itens: number[]
}

export default function Points() {

    const [items, setItems] = useState<Item[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
    const [points, setPoints] = useState<Point[]>([]);

    const navigation = useNavigation();

    useEffect(() => {
        api.get('items')
            .then((response) => {
                setItems(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        const loadPosition = async () => {
            const { status } = await Location.requestPermissionsAsync();

            if (status != 'granted') {
                Alert.alert('Atenção', 'É preciso acesso à sua localização para usar esse app.');
                return;
            }

            const location = await Location.getCurrentPositionAsync();
            const { latitude, longitude } = location.coords;
            setInitialPosition([latitude, longitude]);
        }
        loadPosition();
    }, []);

    useEffect(() => {
        if(selectedItems.length !== 0) {
            api.get('points', {
                params: {
                    city: 'Brasília',
                    uf: 'DF',
                    items: selectedItems
                }
            })
            .then(response => {
                setPoints(response.data);
            })
            .catch(err => {
                Alert.alert(err);
            });
        }
        else {
            setPoints([]);
        }
    }, [selectedItems]);

    const handleNavigateBack = () => {
        navigation.goBack();
    }

    const handleNavigateToDetail = (id: number) => {
        navigation.navigate('Detail', { pointId: id });
    }

    const handleSelectItem = (id: number) => {
        const alreadySelected = selectedItems.findIndex((element) => element === id);
        if (alreadySelected >= 0) {
            const filteredItems = selectedItems.filter((element) => element !== id);
            setSelectedItems(filteredItems);
        }
        else {
            setSelectedItems([...selectedItems, id]);
        }
    }

    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleNavigateBack}>
                    <Icon name="arrow-left" size={20} color="#34CB79" />
                </TouchableOpacity>
                <Text style={styles.title}>Bem-vindo</Text>
                <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>
                <View style={styles.mapContainer}>
                    {initialPosition[0] !== 0 && (
                        <MapView
                            style={styles.map}
                            loadingEnabled={initialPosition[0] === 0}
                            initialRegion={{
                                latitude: initialPosition[0],
                                longitude: initialPosition[1],
                                latitudeDelta: 0.14,
                                longitudeDelta: 0.14
                            }}>
                            {selectedItems.length > 0 && points.map(point => (
                                <Marker
                                    key={point.id}
                                    style={styles.mapMarker}
                                    coordinate={{
                                        latitude: Number(point.latitude),
                                        longitude: Number(point.longitude)
                                    }}
                                    onPress={() => handleNavigateToDetail(point.id)}
                                >
                                    <View style={styles.mapMarkerContainer}>
                                        <Image
                                            style={styles.mapMarkerImage}
                                            source={{ uri: point.image }}
                                        />
                                        <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                                    </View>
                                </Marker>
                            ))}
                        </MapView>
                    )}
                </View>
            </View>
            <View style={styles.itemsContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20 }}>
                    {items.map((item) => (
                        <TouchableOpacity
                            key={String(item.id)}
                            style={
                                [
                                    styles.item,
                                    selectedItems.includes(item.id) ? [styles.selectedItem] : {}
                                ]
                            }
                            activeOpacity={0.6}
                            onPress={() => handleSelectItem(item.id)}
                        >
                            <SvgUri width={42} height={42} uri={item.imageUrl} />
                            <Text style={styles.itemTitle}>{item.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </>
    );
}