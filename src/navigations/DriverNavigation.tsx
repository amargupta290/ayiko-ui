import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
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
} from 'screens';
import OrderList from 'screens/OrderList';
import Feather from 'react-native-vector-icons/Feather';
import {useAppSelector} from 'hooks';
import {RootState} from 'store';
import OrderDetail from 'screens/OrderDetail';
import DriverHomeScreen from 'screens/DriverHome';
import DriverDeliveryDetail from 'screens/DriverDliveryDetail';

const Stack = createNativeStackNavigator();

const DriverNavigation = () => {
  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts});
  const customerData = useAppSelector(
    (state: RootState) => state.auth.customerData,
  );
  return (
    <Stack.Navigator
      initialRouteName={'DriverHomeScreen'}
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
        name="DriverHomeScreen"
        component={DriverHomeScreen}
        options={({navigation}) => ({
          headerBackTitleVisible: false,
          title: '',
          headerShown: true,
          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: () => (
            <View style={styles.headerLeft}>
              <SVGWaveIcon />
              <Text style={styles.headerTitleStyle}>
                Hello {customerData?.name}
              </Text>
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('UserProfileScreen')}>
              {/* <SVGProfilePic /> */}
              <Image
                source={require('../assets/image/profilePic.png')}
                style={{
                  resizeMode: 'cover',
                  width: 50,
                  height: 50,
                }}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Tracking',
        }}
        name="DriverDeliveryDetailScreen"
        component={DriverDeliveryDetail}
      />
    </Stack.Navigator>
  );
};

export default DriverNavigation;

const Styles = ({colors, fonts}: any) =>
  StyleSheet.create({
    headerTitleStyle: {
      ...fonts.title,
      color: colors.white,
    },
    headerLeft: {flexDirection: 'row', gap: 5},
  });
