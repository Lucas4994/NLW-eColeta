import React, { useEffect, useState } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, ImageBackground, Image, Text, StyleSheet } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import RNPickerSelect, { Item as ItemInterface} from 'react-native-picker-select';

interface IBGEUfResponse {
  sigla: string
}

interface IBGECityResponse {
  nome: string
}

interface Item {
  labe: string,
  value: string
}



const Home = () => {
  const [ufs, setUfs] = useState<ItemInterface[]>([]);
  const [cities, setCities] = useState<ItemInterface[]>([]);
  const navigation = useNavigation();

  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  useEffect(() => {
    axios.get<IBGEUfResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => {
        const ufInitials : ItemInterface[] = response.data.map(uf => {
           const item : ItemInterface = {
            label: uf.sigla,
            value: uf.sigla
          };
          return item; 
        });

        setUfs(ufInitials);
      });

  }, [])

  useEffect(() => {
    if (selectedUf === '0') {
      return;
    }

    axios
      .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(response => {
        const cityNames: ItemInterface[]  = response.data.map(city => {

          const item: ItemInterface = {
            label: city.nome,
            value: city.nome
          }

          return item;
        });
        setCities(cityNames);
      });


  }, [selectedUf]);

  function handleSelectUf(value: string) {
    const uf = value;
    setSelectedUf(uf);  
  }

  function handleSelectCity (value: string) {
    const cityName = value;
    setSelectedCity(cityName);  
  }

  function handleNavigateToPoins() {
    navigation.navigate('Points', {uf: selectedUf, city: selectedCity});
  }

  return (
    (<ImageBackground
      source={require('../../assets/home-background.png')}
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente </Text>
      </View>

      <View style={styles.footer}>

        <RNPickerSelect
          placeholder={{ label: 'Selecione uma uf...'}}
          onValueChange={(value) => handleSelectUf(value)}
          items={ufs}
        />
        <RNPickerSelect
          placeholder={{label: 'Selecione uma cidade...'}}
          onValueChange={(value) => handleSelectCity(value)}
          items={cities}
        />
        <RectButton style={styles.button} onPress={handleNavigateToPoins}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#FFF" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>)
  )
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    color: 'black',
    paddingRight: 30, 
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 10,
    color: 'black',
    paddingRight: 30,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#f0f0f5',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;
