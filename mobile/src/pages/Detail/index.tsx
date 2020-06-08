import React, { useEffect, useState } from 'react';
import { View, Image, Text, TouchableOpacity, SafeAreaView, Alert, Linking } from 'react-native';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import * as MailComposer from 'expo-mail-composer';
import styles from './styles';
import api from '../../services/api';

interface Params {
    pointId: number
}

interface Point {
    point: {
        image: string,
        name: string,
        email: string,
        whatsapp: string,
        city: string,
        uf: string
    },
    items: {
        title: string
    }[]
}

export default function Detail() {

    const [pointData, setPointData] = useState<Point>({} as Point);

    const route = useRoute();
    const { pointId } = route.params as Params;

    const navigation = useNavigation();

    const handleNavigateBack = () => {
        navigation.goBack();
    }

    useEffect(() => {
        api.get(`points/${pointId}`)
            .then(response => {
                setPointData(response.data);
            })
            .catch(err => {
                Alert.alert(err);
            });
    }, []);

    if(!pointData.point) {
        return null;
    }

    const handleComposeMail = () => {
        MailComposer.composeAsync({
            subject: 'Interesse na Coleta de Resíduos',
            recipients: [pointData.point.email],
            body: ''
        });
    }

    const handleWhatsapp = () => {
        Linking.openURL(
        `whatsapp://send?phone=${pointData.point.whatsapp}&text=Olá ${pointData.point.name}, tenho interesse na coleta de resíduos.`);
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleNavigateBack}>
                    <Icon name="arrow-left" size={20} color="#34CB79" />
                </TouchableOpacity>
                <Image
                    style={styles.pointImage}
                    source={{ uri: pointData.point.image }}
                />
                <Text style={styles.pointName}>{pointData.point.name}</Text>
                <Text style={styles.pointItems}>{pointData.items.map(item => item.title).join(', ')}</Text>
                <View style={styles.address}>
                    <Text style={styles.addressTitle}>Endereço</Text>
                    <Text style={styles.addressContent}>{`${pointData.point.city} - ${pointData.point.uf}.`}</Text>
                </View>
            </View>
            <View style={styles.footer}>
                <RectButton style={styles.button} onPress={() => handleWhatsapp()}>
                    <FontAwesome name="whatsapp" size={20} color="#FFFFFF" />
                    <Text style={styles.buttonText}>WhatsApp</Text>
                </RectButton>
                <RectButton style={styles.button} onPress={() => handleComposeMail()}>
                    <Icon name="mail" size={20} color="#FFFFFF" />
                    <Text style={styles.buttonText}>Email</Text>
                </RectButton>
            </View>
        </SafeAreaView>
    )
}