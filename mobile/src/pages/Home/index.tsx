import React, { useEffect, useState } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, Image, ImageBackground, Text, Alert, Picker } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
import axios from 'axios';

const logo = require('../../assets/logo.png');
const background = require('../../assets/home-background.png');

interface Uf {
    id: number,
    sigla: string,
    nome: string
}

interface Refact {
    label: string,
    value: string
}

interface City {
    id: number,
    nome: string
}

export default function Home() {

    const [ufs, setUfs] = useState<Uf[]>([]);
    const [selectedUf, setSelectedUf] = useState<string>('0');
    const [cities, setCities] = useState<City[]>([]);
    const [selectedCity, setSelectedCity] = useState<string>('0');

    const navigation = useNavigation();

    const handleNavigationToPoints = () => {
        navigation.navigate('Points');
    }

    useEffect(() => {
        axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
            .then(response => {
                setUfs(response.data);
            })
            .catch(err => {
                Alert.alert(err);
            });
    }, []);

    useEffect(() => {
        if(selectedUf === '0') {
            setCities([]);
            return;
        }
        axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(response => {
                setCities(response.data);
            })
            .catch(err => {
                Alert.alert(err);
            });
    }, [selectedUf]);

    if(!ufs[0]) {
        return null;
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
                <View style={styles.selectView}>
                    <Picker
                        selectedValue={selectedUf}
                        onValueChange={value => setSelectedUf(value)}
                        style={styles.select}
                    >
                        <Picker.Item label="Selecione um estado" value="0" />
                        {ufs.map(uf => (
                            <Picker.Item key={String(uf.id)} label={`${uf.nome} - ${uf.sigla}`} value={String(uf.id)} />
                        ))}
                    </Picker>
                </View>
                <View style={styles.selectView}>
                    <Picker
                        selectedValue={selectedCity}
                        onValueChange={value => setSelectedCity(value)}
                        style={styles.select}
                    >
                        <Picker.Item label="Selecione uma cidade" value="0" />
                        {cities.map(city => (
                            <Picker.Item key={String(city.id)} label={city.nome} value={String(city.id)} />
                        ))}
                    </Picker>
                </View>
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