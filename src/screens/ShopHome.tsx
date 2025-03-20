import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';

type RootStackParamList = {
  ShopHome: {user: any; shopData: any};
};
type ShopHomeNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ShopHome'
>;

type ShopHomeRouteProp = RouteProp<RootStackParamList, 'ShopHome'>;

interface ShopHomeProps {
  route: ShopHomeRouteProp;
  navigation: ShopHomeNavigationProp; // Khai báo navigation prop
}

const ShopHome: React.FC<ShopHomeProps> = ({route, navigation}) => {
  return (
    <View>
      <Text>ShopHome</Text>
    </View>
  );
};

export default ShopHome;

const styles = StyleSheet.create({});
