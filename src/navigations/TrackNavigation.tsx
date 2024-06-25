import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import SupplierListScreen from '../screens/SuppliersList';
import AddBusinessInfo from 'screens/AddBusinessInfo';
import SupplierScreen from 'screens/SupplierScreen';
import ProductList from 'screens/ProductList';
import {useTheme} from '@react-navigation/native';
import {SVGProfilePic, SVGWaveIcon} from 'assets/image';
import {
  CatalogScreen,
  CongratulationScreen,
  HomeScreen,
  OrderDetailsScreen,
  TrackScreen,
} from 'screens';
import OrderList from 'screens/OrderList';
import Feather from 'react-native-vector-icons/Feather';
import {useAppSelector} from 'hooks';
import {RootState} from 'store';
import OrderDetail from 'screens/OrderDetail';
import TrackOrderList from 'screens/TrackOrderList';

const Stack = createNativeStackNavigator();

const TrackNavigation = () => {
  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts});
  const customerData = useAppSelector(
    (state: RootState) => state.auth.customerData,
  );
  return (
    <Stack.Navigator
      initialRouteName={'trackOrderList'}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: 'white',
        headerShadowVisible: false,
        headerTitleAlign: 'center',
        headerTitleStyle: styles.headerTitleStyle,
        headerBackTitleVisible: false,
      }}>
      <Stack.Screen
        name="trackOrderList"
        component={TrackOrderList}
        options={({navigation}) => ({
          title: '',
          headerShown: false,
        })}
      />
      <Stack.Screen
        options={{
          title: 'Track Your Order',
        }}
        initialParams={{catalogData: null}}
        name="TrackScreen"
        component={TrackScreen}
      />
    </Stack.Navigator>
  );
};

export default TrackNavigation;

const Styles = ({colors, fonts}: any) =>
  StyleSheet.create({
    headerTitleStyle: {
      ...fonts.title,
      color: colors.white,
    },
    headerLeft: {flexDirection: 'row', gap: 5},
  });
