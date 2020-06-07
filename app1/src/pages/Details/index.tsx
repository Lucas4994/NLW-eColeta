import React, { useEffect, useState } from 'react';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, StyleSheet, TouchableOpacity, Image, Text, SafeAreaView, Linking } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import Constants from 'expo-constants';
import api from '../../services/api';
import { AppLoading } from 'expo';
import * as MailComposer from 'expo-mail-composer';
import Points from '../Points';

interface Params {
  point_id: string
}

interface Data {
  point: {
    iamge: string,
    email: string,
    whatsapp: string,
    city: string,
    uf: string,
    name: string,
    latitude: number,
    longitude: number
  }
  items: {
    title: string
  }[]
}

const Details = () => {

  const [data, setData] = useState<Data>({} as Data);

  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as Params;

  useEffect(() => {
    api.get(`points/${routeParams.point_id}`).then(response => {
      setData(response.data);
      console.log(response.data)
    });
  }, []);

  if (!data.point) {
    return <AppLoading />
  }


  function handleNavigationBack() {
    navigation.goBack();
  }

  function handleNavigateToHowToGet(){
    navigation.navigate('HowToGet', { latitude: data.point.latitude, longitude: data.point.longitude });
  }

  function handleWhatsapp() {
    Linking.openURL(`whatsapp://send?phone=${data.point.whatsapp}&text=Tenho interesse sobre coleta de resíduos`)

  }

  function handleComposeMail() {
    MailComposer.composeAsync({
      subject: 'Interesse na coleta de resíduos',
      recipients: [data.point.email],
    });
  }





  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigationBack}>
          <Icon name="arrow-left" size={24} color="#34cb79" />
        </TouchableOpacity>
        <Image style={styles.pointImage} source={{ uri: data.point.iamge }} />

        <Text style={styles.pointName}>{data.point.name}</Text>
        <Text style={styles.pointItems}>{data.items.map(item => item.title).join(', ')}</Text>

        <View style={styles.address}>
          <Text style={styles.addressTitle}>Endereço</Text>
          <Text style={styles.addressContent}>{data.point.city}, {data.point.uf}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={() => { }}>
          <FontAwesome name="whatsapp" size={20} color='#FFF' />
          <Text style={styles.buttonText} onPress={handleWhatsapp}>Whatsapp</Text>
        </RectButton>

        <RectButton style={styles.button} onPress={handleComposeMail}>
          <Icon name="mail" size={20} color='#FFF' />
          <Text style={styles.buttonText}>E-Mail</Text>
        </RectButton>

        <RectButton style={styles.button} onPress={handleNavigateToHowToGet}>
          <Icon name="map-pin" size={20} color='#FFF' />
          <Text style={styles.buttonText}>Como chegar?</Text>
        </RectButton>

      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  pointImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: '#322153',
    fontSize: 28,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  pointItems: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  address: {
    marginTop: 32,
  },

  addressTitle: {
    color: '#322153',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  addressContent: {
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: 'column',
    alignItems: 'center'
  },

  button: {
    width: '48%',
    backgroundColor: '#34CB79',
    marginBottom: 7,
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    marginLeft: 8,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
});

export default Details;
