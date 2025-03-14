import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack'; // Import StackNavigationProp

type RootStackParamList = {
  RegisShop: {user: any};
  RegisShop2: {user: any};
};
type RegisShopNavigationProp = StackNavigationProp<
  RootStackParamList,
  'RegisShop'
>;

type RegisShopRouteProp = RouteProp<RootStackParamList, 'RegisShop'>;

interface RegisShopProps {
  route: RegisShopRouteProp;
  navigation: RegisShopNavigationProp;
}

const RegisShop: React.FC<RegisShopProps> = ({navigation, route}) => {
  const {user} = route.params;
  console.log();
  console.log('User data: ', user);
  return (
    <View style={{flex: 1}}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.back}
          onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/icons/Vector.png')}
            style={{width: 20, height: 20}}
          />
        </TouchableOpacity>
        <Text style={styles.headertext}>Chào mừng đến với Book'S Haven!</Text>
      </View>

      <View
        style={{height: 2, backgroundColor: 'rgba(200, 200, 200, 1)'}}></View>

      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'center',
          width: 'auto',
          height: 300,
        }}>
        <Image
          source={require('../assets/image/Frame1.png')}
          //   style={{width: 'auto', height: 300}}
        />
      </View>

      <View style={{alignItems: 'center', marginBottom: 20}}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('RegisShop2', {user})}>
          <Text style={styles.buttontext}>Bắt đầu đăng ký</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    padding: 20,
  },
  back: {
    marginEnd: 30,
    marginTop: 4,
  },
  headertext: {
    fontSize: 20,
  },
  button: {
    width: 400,
    height: 40,
    backgroundColor: '#00B822',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  buttontext: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default RegisShop;
