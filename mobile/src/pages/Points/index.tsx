import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import api from '../../services/api';
import styles from './styles';

interface Item {
    id: number,
    name: string,
    imageUrl: string
}

export default function Points() {

    const [items, setItems] = useState<Item[]>([]);

    const navigation = useNavigation();

    useEffect(() => {
        api.get('items')
            .then((response) => {
                setItems(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [])

    const handleNavigateBack = () => {
        navigation.goBack();
    }

    const handleNavigateToDetail = () => {
        navigation.navigate('Detail');
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
                    <MapView style={styles.map} initialRegion={{
                        latitude: -15.6185395,
                        longitude:-47.6356764,
                        latitudeDelta: 0.014,
                        longitudeDelta: 0.014  
                    }}>
                        <Marker
                            style={styles.mapMarker}
                            coordinate={{
                                latitude: -15.6185395,
                                longitude: -47.6356764
                            }}
                            onPress={handleNavigateToDetail}
                        >
                            <View style={styles.mapMarkerContainer}>
                                <Image
                                    style={styles.mapMarkerImage}
                                    source={{ uri: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=80' }}
                                />
                                <Text style={styles.mapMarkerTitle}>Mercado</Text>
                            </View>
                        </Marker>
                    </MapView>
                </View>
            </View>
            <View style={styles.itemsContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20 }}>
                    {items.map((item) => (
                        <TouchableOpacity key={item.id} style={styles.item} onPress={() => {}}>
                            <SvgUri width={42} height={42} uri={item.imageUrl}/>
                            <Text style={styles.itemTitle}>{item.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </>  
    );
}