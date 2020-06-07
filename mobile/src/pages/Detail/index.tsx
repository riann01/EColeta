import React from 'react';
import { View, Image, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import styles from './styles';

export default function Detail() {

    const navigation = useNavigation();

    const handleNavigateBack = () => {
        navigation.goBack();
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleNavigateBack}>
                    <Icon name="arrow-left" size={20} color="#34CB79" />
                </TouchableOpacity>
                <Image
                    style={styles.pointImage}
                    source={{ uri: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=80' }}
                />
                <Text style={styles.pointName}>Mercado</Text>
                <Text style={styles.pointItems}>Làmpadas, Óleo de Cozinha</Text>
                <View style={styles.address}>
                    <Text style={styles.addressTitle}>Endereço</Text>
                    <Text style={styles.addressContent}>Endereço vai aqui.</Text>
                </View>
            </View>
            <View style={styles.footer}>
                <RectButton style={styles.button} onPress={() => {}}>
                    <FontAwesome name="whatsapp" size={20} color="#FFFFFF" />
                    <Text style={styles.buttonText}>WhatsApp</Text>
                </RectButton>
                <RectButton style={styles.button} onPress={() => {}}>
                    <Icon name="mail" size={20} color="#FFFFFF" />
                    <Text style={styles.buttonText}>Email</Text>
                </RectButton>
            </View>
        </SafeAreaView>
    )
}