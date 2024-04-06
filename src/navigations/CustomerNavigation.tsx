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
} from 'screens';
import OrderList from 'screens/OrderList';
import Feather from 'react-native-vector-icons/Feather';
import {useAppSelector} from 'hooks';
import {RootState} from 'store';
import OrderDetail from 'screens/OrderDetail';

const Stack = createNativeStackNavigator();

const CustomerNavigation = () => {
  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts});
  const customerData = useAppSelector(
    (state: RootState) => state.auth.customerData,
  );
  return (
    <Stack.Navigator
      initialRouteName={'Home'}
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
        name="Home"
        component={HomeScreen}
        options={({navigation}) => ({
          title: '',
          headerLeft: () => (
            <View style={styles.headerLeft}>
              <SVGWaveIcon />
              <Text style={styles.headerTitleStyle}>
                Hello {customerData?.fullName}
              </Text>
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('UserProfileScreen')}>
              <SVGProfilePic />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        options={{
          title: 'Neha Nandanikar',
        }}
        initialParams={{catalogData: null}}
        name="OrderDetailsScreen"
        component={OrderDetailsScreen}
      />
      <Stack.Screen
        options={{
          title: 'Business Info',
        }}
        initialParams={{catalogData: null}}
        name="AddBusinessInfo"
        component={AddBusinessInfo}
      />
      <Stack.Screen
        name="SupplierListScreen"
        component={SupplierListScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SupplierScreen"
        component={SupplierScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProductList"
        component={ProductList}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CatalogScreen"
        component={CatalogScreen}
        options={({navigation}) => ({
          title: 'Catalog',
        })}
      />
      <Stack.Screen
        name="OrderList"
        component={OrderList}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="OrderDetailScreen"
        component={OrderDetail}
        options={({navigation, route}) => ({
          headerLeft: () => {
            return (
              <TouchableOpacity
                // style={{width: '35%'}}
                onPress={() => {
                  navigation.goBack();
                }}>
                <Feather name="arrow-left" size={25} color={colors.white} />
              </TouchableOpacity>
            );
          },
          // eslint-disable-next-line react/no-unstable-nested-components
          headerTitle: () => (
            <View>
              <Text style={[styles.headerTitleStyle]}>OrderDetail</Text>
            </View>
          ),
          tabBarStyle: {
            display: 'none',
          },

          // headerRight: () => <View></View>,
          headerShown: true,
          // title: 'Cart',
          // tabBarIcon: ({color}) => <SVGCart fill={color} strokeWidth="2" />,
        })}
      />
    </Stack.Navigator>
  );
};

export default CustomerNavigation;

const Styles = ({colors, fonts}: any) =>
  StyleSheet.create({
    headerTitleStyle: {
      ...fonts.title,
      color: colors.white,
    },
    headerLeft: {flexDirection: 'row', gap: 5},
  });
