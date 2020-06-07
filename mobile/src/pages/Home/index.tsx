import React from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, Image, ImageBackground, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';

const logo = require('../../assets/logo.png');
const background = require('../../assets/home-background.png');

export default function Home() {

    const navigation = useNavigation();

    const handleNavigationToPoints = () => {
        navigation.navigate('Points');
    }

    return (
        <ImageBackground
            source={background}
            style={styles.container}
            imageStyle={{ width: 274, height: 368 }}
            >
            <View style={styles.main}>
                <Image source={logo} />
                <Text style={styles.title}>
                    Seu marketplace de coleta de resíduos.
                </Text>
                <Text style={styles.description}>
                    Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
                </Text>
            </View>
            <View style={styles.footer}>
                <RectButton style={styles.button} onPress={handleNavigationToPoints}>
                    <View style={styles.buttonIcon}>
                        <Icon name="arrow-right" color="#FFFFFF" size={24}/>
                    </View>
                    <Text style={styles.buttonText}>
                        Entrar
                    </Text>
                </RectButton>
            </View>
        </ImageBackground>
    );
}